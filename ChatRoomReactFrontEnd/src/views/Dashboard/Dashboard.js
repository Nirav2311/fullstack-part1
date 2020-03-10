import React, { Component } from 'react';
import { Container, Typography, Button, TextField, AppBar, Toolbar, IconButton } from '@material-ui/core';
import Loader from './../../components/Loader.js';
import io from 'socket.io-client';
import SendIcon from '@material-ui/icons/Send';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import moment from 'moment';
import API from './../../constants/APIurls.js';

const socket = io(API.BASE_URL);

const styles = {
    mainContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        margin: '20px',
        flexDirection: 'column',
    },
    bottomBar: {
        position: 'fixed',
        left: 0,
        bottom: 0,
        right: 0,
        display: "flex",
        flexDirection: 'row',
        padding: '5px',
        borderTop: '1px solid #949494',
        backgroundColor: 'white'
    },
    bottomBarLeft: {
        flex: 1
    },
    bottomBarRgt: {
        display: "flex",
        width: '60px',
        alignItems: 'center',
        justifyContent: 'center',
    },
    msgDiv: {
        border: '1px solid #949494',
        borderRadius: '5px',
        margin: '5px',
        padding: '5px'
    },
    msgListView: {
        marginBottom: '80px',
        marginTop: '80px'
    },
    appBar: {
        display: 'flex',
        justifyContent: 'space-between'
    }
};

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            message: "",
            isScreenLoading: true,
            isSocketConnected: false,
            messageList: [],
            loggedInUserID: "",

        };
    }

    componentDidUpdate() {
    }

    componentDidMount() {
        let loggedInUser = localStorage.getItem('loggedInUser') && JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            this.setState({
                username: loggedInUser.username,
                loggedInUserID: loggedInUser._id
            });
        }

        this.connectSocket();

        this.setDisconnectSocketListner();

        this.getMessageListFromServer();

    }

    connectSocket = () => {
        // make sure our socket is connected to the port
        socket.on('connect', () => {
            this.setState({
                isSocketConnected: true
            });

            socket.on('receive_msg_from_server', res => {
                if (res) {
                    let { messageList } = this.state;
                    messageList.push(res);
                    this.setState({
                        messageList
                    }, () => {
                        setTimeout(() => {
                            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
                        }, 20);
                    });
                }
            });

            socket.on('receive_likes_count_from_server', res => {
                if (res) {
                    let { messageList } = this.state;
                    let messageIndex = -1;
                    messageList.map((obj, index) => {
                        if (obj._id == res._id) {
                            messageIndex = index;
                        }
                    });
                    messageList[messageIndex] = JSON.parse(JSON.stringify(res));

                    this.setState({
                        messageList: messageList
                    });
                }
            });
        });
    }


    setDisconnectSocketListner = () => {
        socket.on('disconnect', () => {
            console.log('==disconnected===>');
            socket.close();
            this.setState({
                isSocketConnected: false
            });
        });
    }

    onPressLogout = (e) => {
        e.preventDefault();
        console.log("logout");
        this.setState({
            isScreenLoading: true
        });
        setTimeout(() => {
            localStorage.removeItem('loggedInUser');
            this.props.history.replace('/');
        }, 2000);
    }

    onChangeMessage = (e) => {
        this.setState({
            message: e.target.value
        });
    }

    onPressSend = () => {
        let { isSocketConnected, message, loggedInUserID, username } = this.state;
        if (message.length == 0) {
            return false;
        }
        let msgObj = {
            from: loggedInUserID,
            username: username,
            text: message,
            createdAt: moment().format('YYYY-MM-DD hh:mm')
        };
        if (isSocketConnected) {
            this.setState({
                message: ""
            });
            socket.emit('send_msg_to_server', msgObj);
        } else {
            alert("Server error. Press Retry to connect again...");
        }
    }

    onPressLike(messageObj) {
        let { loggedInUserID } = this.state;

        socket.emit('like_dislike_msg', {
            from: loggedInUserID,
            messageId: messageObj._id
        });

    }

    getMessageListFromServer = () => {
        let url = API.BASE_URL + API.GET_MESSAGE_LIST;
        let method = "POST";

        fetch(url, {
            method: method,

        })
            .then((response) => response.json())
            .then((res) => {
                debugger;
                if (res.status == "success" && res.code == 200) {
                    let { messageList } = this.state;
                    messageList.push(...res.data);
                    this.setState({
                        isScreenLoading: false,
                        messageList
                    }, () => {
                        setTimeout(() => {
                            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
                        }, 20);
                    });
                } else {
                    this.setState({
                        isScreenLoading: false,
                    });
                }
            })
            .catch((e) => {
                throw e;
            });
    }

    render() {
        let { username, isScreenLoading, messageList, loggedInUserID } = this.state;
        return (
            <div>
                <AppBar position="fixed"  >
                    <Toolbar style={styles.appBar}>
                        <Typography variant="h5" noWrap>
                            Mintbean Chatroom
                        </Typography>

                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="end"
                            onClick={this.onPressLogout}
                        >
                            <Typography variant="h6" noWrap style={{ marginRight: '20px' }}>
                                Hello {username}
                            </Typography>

                            <ExitToAppIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="xl" component="main">
                    {
                        <div style={styles.msgListView}>
                            {
                                messageList.map(obj => {
                                    if (obj) {
                                        let hasMyLike = obj.likesFrom && obj.likesFrom.indexOf(loggedInUserID) >= 0;
                                        return (
                                            <div style={{
                                                ...styles.msgDiv,
                                                backgroundColor: ((obj.from == loggedInUserID) ? '#c8fdd2' : 'white'),
                                                marginLeft: ((obj.from == loggedInUserID) ? '0px' : '100px'),
                                                marginRight: ((obj.from == loggedInUserID) ? '100px' : '0px'),
                                            }}>
                                                <Typography variant="h6" component="h6">{obj.username}</Typography>
                                                <Typography component="div">{obj.text}</Typography>
                                                <Typography component="div">{obj.createdAt}</Typography>

                                                <Button color="primary" variant="outlined"
                                                    onClick={() => this.onPressLike(obj)}>
                                                    {obj.likesFrom ? obj.likesFrom.length : 0}
                                                    {
                                                        hasMyLike ?
                                                            <FavoriteIcon color="primary" style={{ fontSize: 15 }} /> :
                                                            <FavoriteBorderIcon color="primary" style={{ fontSize: 15 }} />
                                                    }
                                                </Button>
                                            </div>
                                        )
                                    }

                                })
                            }
                        </div>
                    }

                </Container >
                {
                    <div style={styles.bottomBar}>
                        <div style={styles.bottomBarLeft}>
                            <TextField
                                id="outlined-uncontrolled"
                                label="Type here..."
                                defaultValue=""
                                // margin="normal"
                                fullWidth
                                onChange={this.onChangeMessage}
                                value={this.state.message}
                            />

                        </div>
                        <div style={styles.bottomBarRgt}>
                            <Button color="primary" onClick={this.onPressSend}>
                                <SendIcon style={{ fontSize: 30 }} />
                            </Button>

                        </div>

                    </div>
                }
                {
                    isScreenLoading && <Loader />
                }
            </div >
        );
    }
}
export default Dashboard;
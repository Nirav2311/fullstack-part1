import React, { Component } from 'react';
import { Container, TextField, Typography, Button, Grid, Paper } from '@material-ui/core';
import { Chat } from '@material-ui/icons';
import chatImage from './../../assets/images/chat.png';
import API from './../../constants/APIurls.js';
import Loader from './../../components/Loader.js';
let passwordHash = require('password-hash');

const styles = {
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        width: "100%"
    },
    btnSignIn: {
        marginTop: '10px',
    },
    chatImg: {
        width: "100%",
        height: '100vh'
    },
    newUser: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        marginTop: '10px',
        width: "100%"
    },
    rigthView: {
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
    }
};

class Signin extends Component {
    constructor() {
        super();

        this.state = {
            email: "",
            password: "",
            username: "",
            isSignUp: false,
            isScreenLoading: false
        }
    }

    componentWillMount() {
        if (localStorage.getItem('loggedInUser')) {
            this.props.history.push("/dashboard");
        }
    }

    onPressNewOrAlready = (e) => {
        this.setState({
            isSignUp: (!this.state.isSignUp)
        });
    }

    onChangeEmail = (e) => {
        this.setState({
            email: e.target.value
        });
    }

    onChangePassword = (e) => {
        this.setState({
            password: e.target.value
        });
    }

    onChangeName = (e) => {
        this.setState({
            username: e.target.value
        });
    }

    onPressSigninSignup = (e) => {
        let { email, password, isSignUp, username } = this.state;
        if (isSignUp) {
            if (!username.trim()) {
                alert("Username required.");
                return false;
            }

            if (!email.trim()) {
                alert("Email required.");
                return false;
            }

            if (!password.trim()) {
                alert("Password required.");
                return false;
            }
        } else {
            if (!email.trim()) {
                alert("Email required.");
                return false;
            }
            if (!password.trim()) {
                alert("Password required.");
                return false;
            }
        }

        let url = API.BASE_URL + API.SIGNIN;
        let method = "POST";
        let payload = {
            email,
            password: isSignUp ? passwordHash.generate(password) : password
        };
        if (isSignUp) {
            url = API.BASE_URL + API.SIGNUP;
            payload.username = username;
        }
        this.setState({
            isScreenLoading: true
        });

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.status == "success" && res.code == 200) {
                    let loggedInUser = res.data.profileData;
                    debugger;
                    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
                    this.props.history.push("/dashboard");
                } else {
                    alert(res.data.errorMsg);
                    this.setState({
                        isScreenLoading: false
                    });
                }
            })
            .catch((e) => {
                throw e;
            });


    }

    render() {
        let { isSignUp, isScreenLoading } = this.state;
        return (
            <Grid container spacing={3} height="100%">
                <Grid item xs={8} height="100%">
                    <img src={chatImage} alt="chat" style={styles.chatImg} />
                </Grid>
                <Grid item xs={4} height="100%" >
                    <Container component="main" maxWidth="xs" style={styles.rigthView}>
                        <div>
                            <div style={styles.header}>
                                <Chat color="primary" style={{ fontSize: 80, marginBottom: 10 }} />
                                <Typography color="primary" variant="h5" component="h2">
                                    {isSignUp ? "SignUp" : "Signin"}
                                </Typography>

                            </div>

                            {
                                isSignUp && <TextField
                                    id="outlined-uncontrolled"
                                    label="Username*"
                                    defaultValue=""
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    onChange={this.onChangeName}
                                />
                            }

                            <TextField
                                id="outlined-uncontrolled"
                                label="Email*"
                                defaultValue=""
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                onChange={this.onChangeEmail}
                            />

                            <TextField
                                id="outlined-uncontrolled"
                                label="Password*"
                                defaultValue=""
                                variant="outlined"
                                type="password"
                                margin="normal"
                                fullWidth
                                onChange={this.onChangePassword}
                            />

                            <Button
                                style={styles.btnSignIn}
                                variant="contained" color="primary"
                                fullWidth
                                margin="normal"
                                onClick={this.onPressSigninSignup}
                            >
                                {isSignUp ? "SignUp" : "Signin"}
                            </Button>

                            <div style={styles.newUser}>

                                <Button
                                    color="primary"
                                    fullWidth
                                    onClick={this.onPressNewOrAlready}
                                >
                                    {
                                        isSignUp ? "Already have an account? Signin here" : "New User? Signup here"
                                    }
                                </Button>
                            </div>
                        </div>
                    </Container>
                </Grid>
                {isScreenLoading && <Loader />}
            </Grid>

        );
    }
}

export default Signin
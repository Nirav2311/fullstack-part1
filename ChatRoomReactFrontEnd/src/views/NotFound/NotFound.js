import React, { Component } from 'react';
import { Container, Typography, Button, CircularProgress, Modal } from '@material-ui/core';

const styles = {
    mainContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100%'
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        margin: '20px',
        flexDirection: 'column',

    }
};

class NotFound extends Component {
    render() {
        return (
            <Container maxWidth="xs" component="main">
                <div style={styles.header}>
                    <Typography color="primary" variant="h5" component="h2">
                        404 - Page not found
                    </Typography>


                </div>
            </Container>
        );
    }
}
export default NotFound;
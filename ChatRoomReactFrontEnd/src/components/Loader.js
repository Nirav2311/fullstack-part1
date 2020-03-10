import React from 'react';
import { CircularProgress, Modal } from '@material-ui/core';

const styles = {
    center: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        height: "100%"
    }
};

const Loader = () => {
    return (<Modal fullScreen open>
        <div style={styles.center}>
            <CircularProgress color="primary" />
        </div>
    </Modal>);
}


export default Loader;
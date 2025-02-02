import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

function EditLocationModal({ adminId, isOpen, onClose, location }) {



    return (
        <>


        </>
    )

}


EditLocationModal.PropTypes = {
    adminId: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
};
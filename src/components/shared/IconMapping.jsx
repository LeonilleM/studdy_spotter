import { FaWifi, FaVolumeMute, FaPlug, FaUsers, FaDoorClosed, FaParking, FaUniversity, FaHamburger } from 'react-icons/fa';
import PropTypes from 'prop-types';

const iconMap = {
    'Wifi': FaWifi,
    'Quiet': FaVolumeMute,
    'Outlet': FaPlug,
    'Group Friendly': FaUsers,
    'Aesthetic': FaDoorClosed,
    'Late Night Access': FaDoorClosed,
    'Private Rooms': FaDoorClosed,
    'Near By Food': FaHamburger,
    'Food Services': FaHamburger,
    'Free Parking': FaParking,
    'Paid Parking': FaParking,
    'On-Campus': FaUniversity,
    'Off-Campus': FaUniversity,
};

const IconSize = ({ Icon, size }) => {
    return <Icon size={size} />;
};

const IconRenderer = ({ iconName, size = 20 }) => {
    const IconComponent = iconMap[iconName];
    if (!IconComponent) return null;
    return <IconSize Icon={IconComponent} size={size} />;
};

IconSize.propTypes = {
    Icon: PropTypes.elementType.isRequired,
    size: PropTypes.number,
};

IconRenderer.propTypes = {
    iconName: PropTypes.string.isRequired,
    size: PropTypes.number,
};

export default IconRenderer;
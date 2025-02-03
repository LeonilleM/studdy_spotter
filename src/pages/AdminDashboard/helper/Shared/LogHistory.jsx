import PropTypes from 'prop-types';
import { format } from 'date-fns';

const LogHistory = ({ logHistory }) => (
    <section className="w-3/5">
        <h2 className="text-darkBlue font-poppins font-bold text-xl mb-1">Update Logs</h2>
        {logHistory.length > 0 ? (
            <div className="overflow-y-auto max-h-[55vh] space-y-4 border border-black border-opacity-10 rounded-lg">
                {logHistory.map((log, index) => (
                    <div
                        key={index}
                        className={`p-4 space-y-1 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                    >
                        <p className="font-medium">{log.Users.first_name} {log.Users.last_name} - Updated on {format(new Date(log.edit_time), 'MM-dd-yyyy HH:mm:ss')}</p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Update Notes:</span> {log.message || 'None'}
                        </p>
                        <ul className="space-y-1">
                            {Object.keys(log.action).map((key, i) => (
                                <li key={i}>
                                    <span className="font-semibold text-darkBlue">{key.toUpperCase()}:</span>{' '}
                                    <span className="text-red-500">Old: {log.action[key].old}</span> |{' '}
                                    <span className="text-green-500">New: {log.action[key].new}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-600 py-6 text-xl">No log history available.</p>
        )}
    </section>
);

LogHistory.propTypes = {
    logHistory: PropTypes.array.isRequired
};

export default LogHistory;
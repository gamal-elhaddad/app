import React from 'react';
import moment from 'moment';
import { Typography, Box, List, ListItem } from '@mui/material';
import { ActionLog, Booking } from 'src/types/apps/booking';
import './LogsView.css';

interface LogItemProps {
    log: ActionLog;
}

const LogItem = ({ log }: LogItemProps) => {
    return (
        <Box className="log-item">
            <Box className={`log-item__timeline log-item__timeline--last`} />
            <Box className="log-item__dot" />
            <ListItem disablePadding>
                <Box className="log-item__content">
                    <Typography variant="body1" color="text.primary" className="log-item__action">
                        <strong>{log.action?.toLocaleUpperCase()} </strong> by {log.user_data.name?.toUpperCase()} ({log.user_data.role})
                        {log.data && (
                            <>
                                <br />
                                {log.data.booking_name && <>{log.data.booking_name}<br /></>}
                                {log.data.match_date && (
                                    <>Match Date: {moment(log.data.match_date).format('YYYY-MM-DD')}<br /></>
                                )}
                                {log.data.match_time && (
                                    <>Match Time: {moment(log.data.match_time, 'HH:mm:ss').format('h:mm A')}<br /></>
                                )}
                                {log.data.booking_status !== undefined && <>Booking Status: {log.data.booking_status}<br /></>}
                                {log.data.booking_type !== undefined && <>Booking Type: {log.data.booking_type}<br /></>}
                                {log.data.booking_phone_number && <>Phone: {log.data.booking_phone_number}<br /></>}
                                {log.data.amount_paid !== undefined && <>Amount Paid: {log.data.amount_paid}<br /></>}
                                {log.data.payment_order_duration && <>Payment Duration: {log.data.payment_order_duration} min<br /></>}
                                {log.data.payment_expected_amount !== undefined && <>Expected Amount: {log.data.payment_expected_amount}<br /></>}
                                {log.data.payment_actual_amount !== undefined && <>Actual Amount: {log.data.payment_actual_amount}<br /></>}
                            </>
                        )}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" className="log-item__time">
                        {moment(log.created_at).format('HH:mm')}
                    </Typography>
                </Box>
            </ListItem>
        </Box>
    );
};

interface LogGroupProps {
    date: string;
    logs: ActionLog[];
}

const LogGroup = ({ date, logs }: LogGroupProps) => {
    return (
        <Box className="log-group">
            <Box className="log-group__date-container">
                <Typography variant="subtitle1" className="log-group__date">
                    {date}
                </Typography>
            </Box>
            <List disablePadding>
                {logs.map((log) => (
                    <LogItem
                        key={log.id}
                        log={log}
                    />
                ))}
            </List>
        </Box>

    );
};

interface LogsViewProps {
    booking: Booking | undefined;
}

const LogsView: React.FC<LogsViewProps> = ({ booking }) => {
    if (!booking || !booking.action_log || booking.action_log.length === 0) {
        return <Typography>No logs available for this booking.</Typography>;
    }

    const groupedLogs = booking.action_log.reduce((acc, log) => {
        const date = moment(log.created_at).format('dddd, MMMM D, YYYY');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(log);

        return acc;
    }, {} as Record<string, ActionLog[]>);

    return (
        <Box className="logs-view">
            <Box className="logs-container">
            {Object.entries(groupedLogs).reverse().map(([date, logs]) => (
                    <LogGroup key={date} date={date} logs={logs} />
                ))}
            </Box>
        </Box>
    );
};

export default LogsView;
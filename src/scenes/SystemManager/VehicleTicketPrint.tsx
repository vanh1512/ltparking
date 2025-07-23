import React, { useEffect } from "react";

const VehicleTicketPrint = ({ vehicle, onClose }) => {

    useEffect(() => {
        // Trigger print on mount
        window.print();

        // Auto-close after printing if you want
        const timer = setTimeout(() => {
            onClose?.();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div id="ticket-print-area">
            <div className="ticket">
                <h2>🚗 Vehicle Entry Ticket</h2>
                <p>Date: {new Date().toLocaleString()}</p>
                <p>Plate: {vehicle}</p>
                {/* <p>Type: {vehicle.type}</p>
                <p>Driver: {vehicle.driverName}</p>
                <p>Entry Point: {vehicle.entryPoint}</p>
                <p>Ticket ID: {vehicle.ticketId}</p>
                <p>Staff: {vehicle.staffName}</p> */}
                <hr />
                <p>Thank you! 🚦</p>
            </div>
        </div>
    );
};

export default VehicleTicketPrint;

import React from "react";
import { ScanUrl } from "../config";

interface ToastSuccessLinkProps {
    message: string;
    link: string;
}

const ToastSuccessLink = ({ message, link }: ToastSuccessLinkProps) => {
    return (
        <div className="toast-success-link">
            <p className="text-black">{message}</p>
            <a
                href={`${ScanUrl.TxBlock}${link}`}
                target="_blank"
                className="text-[#cd8e60] cursor-pointer"
                rel="noreferrer"
            >
                {link.slice(0, 8)}...{link.slice(-3)}
            </a>
        </div>
    );
}

export default ToastSuccessLink;
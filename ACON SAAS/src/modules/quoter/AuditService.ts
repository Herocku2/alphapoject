import type { AuditLog, UserRole } from './types';
import { verifyIPAddress } from './AcceptanceService';

const LOGS_STORAGE_KEY = 'acon_audit_logs';

export const logAction = async (
    userId: string,
    userName: string,
    role: UserRole,
    action: string,
    module: AuditLog['module'],
    targetId: string,
    details: string,
    severity: AuditLog['severity'] = 'info'
): Promise<void> => {
    const ip = await verifyIPAddress();

    const newLog: AuditLog = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        userId,
        userName,
        role,
        action,
        module,
        targetId,
        details,
        severity,
        ip
    };

    const existingLogs = getAuditLogs();
    existingLogs.push(newLog);
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(existingLogs));

    console.log(`[AUDIT] ${action} by ${userName} on ${targetId}`);
};

export const getAuditLogs = (): AuditLog[] => {
    const logs = localStorage.getItem(LOGS_STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
};

export const getLogsByTarget = (targetId: string): AuditLog[] => {
    return getAuditLogs().filter(log => log.targetId === targetId);
};

export const exportAuditLogs = () => {
    const logs = getAuditLogs();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `audit_logs_${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

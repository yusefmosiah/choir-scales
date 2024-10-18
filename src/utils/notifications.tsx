import { toast } from 'react-toastify';
import { getExplorerUrl } from './explorer';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  description?: string;
  txid?: string;
}

export function notify({ type, message, description, txid }: NotificationProps) {
  const content = (
    <div className="flex flex-col gap-1">
      <h1 className="font-bold text-sm text-white">{message}</h1>
      {description && <p className="text-xs text-white">{description}</p>}
      {txid && (
        <a
          href={getExplorerUrl('', txid, 'tx')}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white underline"
        >
          View transaction
        </a>
      )}
    </div>
  );

  toast(content, {
    type,
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}

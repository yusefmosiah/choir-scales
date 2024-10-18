import React from 'react'
import { useEffect } from 'react'
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/outline'
import { XIcon } from '@heroicons/react/solid'
import useNotificationStore from '../stores/useNotificationStore'
import { useNetworkConfiguration } from 'contexts/NetworkConfigurationProvider';

// Define the Notification type
type Notification = {
  type: 'success' | 'error' | 'info';
  message: string;
  description?: string;
  txid?: string;
};

// Update the store type
interface NotificationStore {
  notifications: Notification[];
  set: (fn: (state: NotificationStore) => NotificationStore) => void;
}

// Define props for the Notification component
interface NotificationProps extends Notification {
  onHide: () => void;
}

const NotificationList = () => {
  const { notifications, set: setNotificationStore } = useNotificationStore(
    (s) => s
  ) as NotificationStore;

  const reversedNotifications = [...notifications].reverse()

  return (
    <div
      className={`flex fixed inset-20 z-20 items-end px-4 py-6 pointer-events-none sm:p-6`}
    >
      <div className={`flex flex-col w-full`}>
        {reversedNotifications.map((n, idx) => (
          <Notification
            key={`${n.message}${idx}`}
            type={n.type}
            message={n.message}
            description={n.description}
            txid={n.txid}
            onHide={() => {
              setNotificationStore((state) => {
                const reversedIndex = reversedNotifications.length - 1 - idx;
                return {
                  ...state,
                  notifications: [
                    ...notifications.slice(0, reversedIndex),
                    ...notifications.slice(reversedIndex + 1),
                  ],
                };
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  description,
  txid,
  onHide
}) => {
  const { networkConfiguration } = useNetworkConfiguration();

  useEffect(() => {
    const id = setTimeout(() => {
      onHide()
    }, 8000);

    return () => {
      clearTimeout(id);
    };
  }, [onHide]);

  return (
    <div
      className={`overflow-hidden p-2 mx-4 mt-2 mb-12 w-full max-w-sm rounded-md ring-1 ring-black ring-opacity-5 shadow-lg pointer-events-auto bg-bkg-1`}
    >
      <div className={`p-4 rounded-md bg-gradient-to-r from-purple-900 from-10% via-purple-600 via-30% to-emerald-500 to-90%`}>
        <div className={`flex items-center`}>
          <div className={`flex-shrink-0`}>
            {type === 'success' ? (
              <CheckCircleIcon className={`mr-1 w-8 h-8 text-green`} />
            ) : null}
            {type === 'info' && <InformationCircleIcon className={`mr-1 w-8 h-8 text-red`} />}
            {type === 'error' && (
              <XCircleIcon className={`mr-1 w-8 h-8`} />
            )}
          </div>
          <div className={`flex-1 ml-2 w-0`}>
            <div className={`font-bold text-fgd-1`}>{message}</div>
            {description ? (
              <p className={`mt-0.5 text-sm text-fgd-2`}>{description}</p>
            ) : null}
            {txid ? (
              <div className="flex flex-row">
                <a
                  href={`https://explorer.solana.com/tx/${txid}?cluster=${networkConfiguration}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-row text-emerald-200 link link-accent"
                >
                  <svg className="flex-shrink-0 h-4 ml-2 mt-0.5 text-primary-light w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" ><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  <div className="flex mx-4">{txid.slice(0, 8)}...
                    {txid.slice(txid.length - 8)}
                  </div>
                </a>
              </div>
            ) : null}
          </div>
          <div className={`flex flex-shrink-0 self-start ml-4`}>
            <button
              onClick={() => onHide()}
              className={`inline-flex rounded-md bg-bkg-2 default-transition text-fgd-3 hover:text-fgd-4 focus:outline-none`}
            >
              <span className={`sr-only`}>Close</span>
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationList

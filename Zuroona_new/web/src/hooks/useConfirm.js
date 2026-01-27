import { useState } from 'react';

/**
 * Custom hook to manage confirmation dialog state
 * 
 * Usage:
 * const { showConfirm, confirmProps, openConfirm } = useConfirm();
 * 
 * // In your component:
 * <ConfirmDialog {...confirmProps} />
 * 
 * // To trigger confirmation:
 * openConfirm({
 *   title: "Delete Event?",
 *   description: "This will permanently delete the event",
 *   variant: "danger",
 *   onConfirm: handleDelete
 * });
 */

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: '',
    description: '',
    confirmText: '',
    cancelText: '',
    variant: 'warning',
    onConfirm: () => {},
  });
  const [isLoading, setIsLoading] = useState(false);

  const openConfirm = (options) => {
    setConfig({
      title: options.title || '',
      description: options.description || '',
      confirmText: options.confirmText || '',
      cancelText: options.cancelText || '',
      variant: options.variant || 'warning',
      onConfirm: options.onConfirm || (() => {}),
    });
    setIsOpen(true);
    setIsLoading(false);
  };

  const closeConfirm = () => {
    setIsOpen(false);
    setIsLoading(false);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await config.onConfirm();
      closeConfirm();
    } catch (error) {
      console.error('Confirmation action failed:', error);
      setIsLoading(false);
    }
  };

  return {
    showConfirm: isOpen,
    confirmProps: {
      isOpen,
      onClose: closeConfirm,
      onConfirm: handleConfirm,
      title: config.title,
      description: config.description,
      confirmText: config.confirmText,
      cancelText: config.cancelText,
      variant: config.variant,
      isLoading,
    },
    openConfirm,
    closeConfirm,
    setIsLoading,
  };
}


import { useState, useEffect } from 'react';

import { on, off } from '../../utils/listeners';

type ConnectionType =
  | 'bluetooth'
  | 'cellular'
  | 'ethernet'
  | 'mixed'
  | 'none'
  | 'other'
  | 'unknown'
  | 'wifi'
  | 'wimax';

type EffectiveConnectionType = '2g' | '3g' | '4g' | 'slow-2g';

interface NetworkState {
  readonly type?: ConnectionType;
  readonly effectiveType?: EffectiveConnectionType;
  readonly downlinkMax?: number;
  readonly downlink?: number;
  readonly rtt?: number;
  readonly saveData?: boolean;
  onchange?: EventListener;

  readonly online?: boolean;
  readonly since?: Date;
}

type NetworkInformation = EventTarget & NetworkState;

const getConnection = (): NetworkInformation | null => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav = navigator as any;

  return nav.connection || nav.mozConnection || nav.webkitConnection;
};

const getConnectionState = (): NetworkState => {
  const connection = getConnection();

  if (!connection) {
    return {};
  }

  const {
    downlink,
    downlinkMax,
    effectiveType,
    type,
    rtt,
  } = connection;

  return {
    downlink,
    downlinkMax,
    effectiveType,
    type,
    rtt,
  };
};

/**
 * Hook that returns network information
 */

const useNetwork = (): NetworkState => {
  const [state, setState] = useState<NetworkState>({});

  useEffect((): (() => void) => {
    let localState = state;

    const localSetState = (patch: NetworkState): void => {
      localState = { ...localState, ...patch };
      setState(localState);
    };

    const connection = getConnection();

    const handleOnline = (): void => {
      localSetState({
        online: true,
        since: new Date(),
      });
    };

    const handleOffline = (): void => {
      localSetState({
        online: false,
        since: new Date(),
      });
    };

    const onConnectionChange = (): void => {
      const currentState = getConnectionState();

      localSetState(currentState);
    };

    on(window, 'online', handleOnline);
    on(window, 'offline', handleOffline);

    if (connection) {
      on(connection, 'change', onConnectionChange);

      localSetState({
        ...state,
        online: navigator.onLine,
        since: undefined,
        ...getConnectionState(),
      });
    }

    return (): void => {
      off(window, 'online', handleOnline);
      off(window, 'offline', handleOffline);

      if (connection) {
        off(connection, 'change', onConnectionChange);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
};

export default useNetwork;

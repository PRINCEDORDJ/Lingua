import React, { useEffect, useState } from 'react';
import { loadStreamSdk, type StreamVideoSdk } from '@/lib/stream/loadStreamSdk';

interface StreamCallProviderProps {
  client: unknown;
  call: unknown;
  children: React.ReactNode;
}

export function StreamCallProvider({
  client,
  call,
  children,
}: StreamCallProviderProps) {
  const [sdk, setSdk] = useState<StreamVideoSdk | null>(null);

  useEffect(() => {
    if (!client || !call) {
      setSdk(null);
      return;
    }

    let mounted = true;

    loadStreamSdk().then((loaded) => {
      if (mounted) {
        setSdk(loaded);
      }
    });

    return () => {
      mounted = false;
    };
  }, [client, call]);

  if (!sdk || !client || !call) {
    return <>{children}</>;
  }

  const { StreamVideo, StreamCall } = sdk;

  return (
    <StreamVideo client={client as never}>
      <StreamCall call={call as never}>{children}</StreamCall>
    </StreamVideo>
  );
}

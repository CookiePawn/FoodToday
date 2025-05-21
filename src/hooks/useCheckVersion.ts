import { useEffect, useState } from 'react';
import { BackHandler, Linking, Platform } from 'react-native';
import { checkVersion } from 'react-native-check-version';
import { getVersion, getBundleId } from 'react-native-device-info';
import RNExitApp from 'react-native-exit-app';

const useCheckVersion = () => {
  const version = getVersion();
  const bundleId = getBundleId();
  const [alertVisible, setAlertVisible] = useState(false);
  const [updateUrl, setUpdateUrl] = useState('');

  useEffect(() => {
    const checkAppVersion = async () => {
      const isNewVersionAvailable = await checkVersion({
        platform: Platform.OS,
        bundleId: bundleId,
        currentVersion: version,
        country: 'kr',
      });
      if (isNewVersionAvailable) {
        if ('0.0.4' !== isNewVersionAvailable.version) {
          setUpdateUrl(isNewVersionAvailable.url);
          setAlertVisible(true);
        }
      }
    };
    checkAppVersion();
  }, []);

  const handleUpdate = () => {
    Linking.openURL(updateUrl);
    setAlertVisible(false);
  };

  const handleClose = () => {
    setAlertVisible(false);
    RNExitApp.exitApp();
  };

  return {
    alertVisible,
    handleUpdate,
    handleClose
  };
};

export default useCheckVersion;
import { MainStack } from '@/navigate';
import { View } from 'react-native';
import { useCheckVersion, useExitApp } from '@/hooks';
import { CustomAlert } from '@/components';

const App = () => {
  const { alertVisible, handleUpdate, handleClose } = useCheckVersion();
  useExitApp();

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <MainStack />
      {alertVisible && (
        <CustomAlert
          visible={alertVisible}
          title="새로운 버전이 있습니다."
          message="업데이트 하시겠습니까?"
          buttons={[
            { text: '예', onPress: handleUpdate, style: 'default' },
            { text: '아니요', onPress: handleClose, style: 'cancel' },
          ]}
        />
      )}
    </View>
  );
};

export default App;

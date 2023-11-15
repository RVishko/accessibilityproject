import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, Text} from 'react-native';
import NfcManager, {Ndef, NfcEvents, NfcTech} from 'react-native-nfc-manager';

function App(): JSX.Element {
  const [hasNfc, setHasNFC] = useState<boolean>(false);

  useEffect(() => {
    //check NFC is available
    const checkIsSupported = async () => {
      const deviceIsSupported = await NfcManager.isSupported();

      setHasNFC(deviceIsSupported);
      if (deviceIsSupported) {
        await NfcManager.start();
      }
    };

    checkIsSupported();

    //read nfc tag
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
      console.log('tag found', tag);
    });

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    };
  }, []);

  const readTag = async () => {
    await NfcManager.registerTagEvent();
  };

  const writeNFC = async () => {
    let result = false;

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef); //request data format

      const bytes = Ndef.encodeMessage([Ndef.uriRecord('intrivo.com')]);

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        result = true;
      }
    } catch (ex) {
      console.warn(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }

    return result;
  };

  return (
    <SafeAreaView>
      <Text>Accessiblity</Text>
      <Button title="Search Tag" onPress={readTag} />
      <Button title="Search Tag" onPress={writeNFC} />
      {hasNfc && <Text>NFC is supported</Text>}
    </SafeAreaView>
  );
}

export default App;

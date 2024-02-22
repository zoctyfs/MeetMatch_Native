
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
  Modal,
  Button,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';


const Info = ({ route }) => {
  // Get the parameters from the route
  const meetingToken = route.params?.meetingToken || {};
  const meetingInfo = route.params?.meetingInfo || {};
  console.log('meetingToken:',meetingToken);
  console.log('meetingInfo:', meetingInfo);

  const meetMatchLink = `https://meetmatch.us/table/?vToken=${meetingToken?.response.tableVisitToken || ''}`;
  const copyToClipboard = () => {
    Clipboard.setString(meetMatchLink);
    Alert.alert("Copied", "Link has been copied to clipboard!");
  };

  const openLink = () => {
    Linking.openURL(meetMatchLink).catch(err => {
      Alert.alert("Error", "Failed to open link");
    });
  };

  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  const guideContent = [
      "This screen shows the information of the created meeting.",
      "Meeting Name: The name you have given to your meeting.",
      "Dates: The dates selected for the meeting.",
      "Max Participants: The maximum number of participants allowed in the meeting.",
      "You can copy the meeting link to share or open it directly from here."
  ];

    const nextGuideStep = () => {
        if (guideStep < guideContent.length - 1) {
          setGuideStep(guideStep + 1);
        } else {
          setIsGuideVisible(false); // Close the guide
          setGuideStep(0); // Reset guide steps
        }
      };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.guideButton} onPress={() => setIsGuideVisible(true)}>
        <Text style={styles.guideButtonText}>?</Text>
      </TouchableOpacity>

      <Modal visible={isGuideVisible} transparent={true}>
        <View style={styles.guideOverlay}>
          <View style={styles.guideContent}>
            <Text style={styles.guideText}>{guideContent[guideStep]}</Text>
            <Button
              title={guideStep < guideContent.length - 1 ? "Next" : "Close"}
              onPress={nextGuideStep}
              color="#841584"
            />
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Meeting Information</Text>
      <Text style={styles.info}>Name: {meetingInfo.meetingName}</Text>
      <Text style={styles.info}>Dates:</Text>

      <ScrollView style={{marginHorizontal: 20}}>
        {meetingInfo.selectedDates.map((date, index) => (
          <Text key={index} style={styles.dateInfo}>{date}</Text>
        ))}
      </ScrollView>

      <Text style={styles.info}>Max Participants: {meetingInfo.maxParticipants}</Text>
      <Text style={styles.link}>{meetMatchLink}</Text>

      <TouchableOpacity style={styles.button} onPress={copyToClipboard}>
        <Text style={styles.buttonText}>Copy Link</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={openLink}>
        <Text style={styles.buttonText}>Open Link</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  dateInfo: {
    fontSize: 16,
    marginBottom: 5, // 为日期信息提供适当的间距
  },
  link: {
    color: '#0000EE',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#841584',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  guideButton: {
      position: 'absolute',
      right: 20,
      top: 14,
      backgroundColor: '#841584',
      width: 40,
      height: 40,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    guideButtonText: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    guideOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    guideContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 5,
    },
    guideText: {
      fontSize: 16,
      marginBottom: 20,
    },
});

export default Info;

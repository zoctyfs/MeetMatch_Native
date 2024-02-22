import * as api from './api/callapi.js'
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

const MeetCreate = ({ navigation }) => {
  const [meetingName, setMeetingName] = useState('');
  const [selectedDates, setSelectedDates] = useState({}); // 以日期字符串为键，选中状态为值的对象
  const [maxParticipants, setMaxParticipants] = useState('');
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  const guideContent = [
      "Step 1: Enter the meeting name in the designated field.",
      "Step 2: Select the dates for your meeting using the calendar.",
      "Step 3: Enter the maximum number of participants.",
      "Step 4: Click 'Create Meeting' to finalize the meeting setup.",
  ];

  const handleCreate = () => {
    if (meetingName && Object.keys(selectedDates).length > 0 && maxParticipants) {
    const dateSelection = Object.entries(selectedDates)
      .filter(([dateString, value]) => value && value.selected)
      .map(([dateString, value]) => dateString);
//       const dateSelection = selectedDates.map(date => date.format('YYYY-MM-DD'));
      const meetingInfo = {
        meetingName: meetingName,

        selectedDates: Object.keys(selectedDates),
        maxParticipants: maxParticipants,
      };

      api.createTableApi(meetingName, dateSelection, 0, 24, maxParticipants, 'meetingInfo.email')
        .then(response => {
          console.log('Meeting created successfully!' + JSON.stringify(response));
          const meetingToken = {
          response: response
        };
        console.log('selectedDates:', selectedDates,' Object.keys(selectedDates)', Object.keys(selectedDates));
        navigation.navigate('Info', { meetingToken: meetingToken, meetingInfo: meetingInfo });
      })
        .catch(error => {
          alert('Failed to create meeting.');
      });
//       navigation.navigate('Info', meetingInfo);
    } else {
      Alert.alert('Error', 'Please fill in all the fields.');
    }
  };

  const onDayPress = (day) => {
    const { dateString } = day;
    // Toggle selection
    setSelectedDates(prevDates => ({
      ...prevDates,
      [dateString]: !prevDates[dateString] ? {selected: true, marked: true} : undefined,
    }));
  };

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
         <Text style={styles.guideButtonText}>!</Text>
      </TouchableOpacity>
      <Modal visible={isGuideVisible} transparent={true}>
        <View style={styles.guideOverlay}>
          <View style={styles.guideContent}>
            <Text style={styles.guideText}>{guideContent[guideStep]}</Text>
            <Button
              title={guideStep < guideContent.length - 1 ? "Next" : "Close"}
              onPress={nextGuideStep}
            />
          </View>
        </View>
      </Modal>

      <TextInput
        style={styles.input}
        placeholder="Meeting Name"
        value={meetingName}
        onChangeText={setMeetingName}
      />
      <ScrollView>
        <Calendar
          onDayPress={onDayPress}
          markedDates={selectedDates}
          markingType={'multi-dot'}
        />
      </ScrollView>
      <TextInput
        style={styles.input}
        placeholder="Max Participants"
        keyboardType="numeric"
        value={maxParticipants}
        onChangeText={setMaxParticipants}
      />
      <Button
        onPress={handleCreate}
        title="Create Meeting"
        color="#841584"
      />
    </View>
  );
};


const styles = StyleSheet.create({
     container: {
         flex: 1,
         padding: 20,
         backgroundColor: '#f5f5f5',
       },
       input: {
         backgroundColor: '#ffffff',
         borderWidth: 1,
         borderColor: '#ddd',
         borderRadius: 5,
         padding: 10,
         marginBottom: 15,
         fontSize: 16,
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
         top: 410, // Adjusted from bottom to top for right upper corner placement
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
         fontWeight: 'bold', // 可选：增加字体粗细以提高可读性
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
     dateText: {
       fontSize: 16,
       marginBottom: 10, // 为日期文本提供足够的间距，避免拥挤
     },
     title: {
       fontSize: 20,
       fontWeight: 'bold',
       marginBottom: 20, // 标题使用大号字体和加粗，提高层次感
     },
     info: {
       fontSize: 16,
       marginBottom: 10, // 信息文本保持一致的样式，提高整体的协调性
     },
     link: {
       color: '#0000EE', // 链接使用标准的蓝色，用户易于识别
       textDecorationLine: 'underline', // 下划线强调这是可点击的链接
       marginBottom: 20,
     },
});

export default MeetCreate;

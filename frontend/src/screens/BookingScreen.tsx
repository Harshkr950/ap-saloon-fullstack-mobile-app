import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';

const BookingScreen = ({ route, navigation }: any) => {
  const [selectedService, setSelectedService] = useState(route?.params?.service || null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedStylist, setSelectedStylist] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const stylists = [
    { id: 1, name: 'Priya Sharma', speciality: 'Hair Styling', experience: '8 years' },
    { id: 2, name: 'Anjali Patel', speciality: 'Hair Coloring', experience: '6 years' },
    { id: 3, name: 'Meera Singh', speciality: 'Bridal Makeup', experience: '10 years' },
    { id: 4, name: 'Kavya Reddy', speciality: 'Spa Treatments', experience: '5 years' },
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  const getNextDates = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-IN', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return dates;
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !selectedStylist || 
        !customerName || !customerPhone || !customerEmail) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const bookingData = {
      service: selectedService._id || selectedService.id,
      stylist: selectedStylist,
      date: selectedDate,
      time: selectedTime,
    };

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization header with token should be added here after login integration
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Booking failed');
        return;
      }

      const bookingResult = await response.json();

      Alert.alert(
        'Booking Created!',
        `Your appointment has been reserved for ${selectedDate} at ${selectedTime} with ${selectedStylist}.\n\nProceed to payment to confirm your booking.`,
        [
          {
            text: 'Proceed to Payment',
            onPress: () => navigation.navigate('Payment', {
              bookingId: bookingResult._id,
              serviceName: selectedService.name,
              date: selectedDate,
              time: selectedTime,
              stylist: selectedStylist,
              amount: selectedService.price,
            }),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Booking failed. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <Text style={styles.headerSubtitle}>Schedule your salon visit</Text>
      </View>

      {/* Service Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selected Service</Text>
        {selectedService ? (
          <View style={styles.selectedServiceCard}>
            <Text style={styles.selectedServiceName}>{selectedService.name}</Text>
            <Text style={styles.selectedServicePrice}>{selectedService.price}</Text>
            <Text style={styles.selectedServiceDuration}>{selectedService.duration}</Text>
            <TouchableOpacity 
              style={styles.changeServiceButton}
              onPress={() => navigation.navigate('Services')}
            >
              <Text style={styles.changeServiceText}>Change Service</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.selectServiceButton}
            onPress={() => navigation.navigate('Services')}
          >
            <Text style={styles.selectServiceText}>Select a Service</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Date Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {getNextDates().map((dateObj) => (
            <TouchableOpacity
              key={dateObj.date}
              style={[
                styles.dateButton,
                selectedDate === dateObj.date && styles.selectedDateButton,
              ]}
              onPress={() => setSelectedDate(dateObj.date)}
            >
              <Text
                style={[
                  styles.dateText,
                  selectedDate === dateObj.date && styles.selectedDateText,
                ]}
              >
                {dateObj.display}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Time Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.timeGrid}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeButton,
                selectedTime === time && styles.selectedTimeButton,
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text
                style={[
                  styles.timeText,
                  selectedTime === time && styles.selectedTimeText,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stylist Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Stylist</Text>
        {stylists.map((stylist) => (
          <TouchableOpacity
            key={stylist.id}
            style={[
              styles.stylistCard,
              selectedStylist === stylist.name && styles.selectedStylistCard,
            ]}
            onPress={() => setSelectedStylist(stylist.name)}
          >
            <View style={styles.stylistInfo}>
              <Text style={styles.stylistName}>{stylist.name}</Text>
              <Text style={styles.stylistSpeciality}>{stylist.speciality}</Text>
              <Text style={styles.stylistExperience}>{stylist.experience}</Text>
            </View>
            <View style={[
              styles.radioButton,
              selectedStylist === stylist.name && styles.selectedRadioButton,
            ]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Customer Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          value={customerName}
          onChangeText={setCustomerName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number *"
          value={customerPhone}
          onChangeText={setCustomerPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address *"
          value={customerEmail}
          onChangeText={setCustomerEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Booking Summary */}
      {selectedService && selectedDate && selectedTime && (
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service:</Text>
            <Text style={styles.summaryValue}>{selectedService.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={styles.summaryValue}>{selectedDate}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time:</Text>
            <Text style={styles.summaryValue}>{selectedTime}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Stylist:</Text>
            <Text style={styles.summaryValue}>{selectedStylist}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Price:</Text>
            <Text style={styles.summaryPrice}>{selectedService.price}</Text>
          </View>
        </View>
      )}

      {/* Book Button */}
      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
        <Text style={styles.bookButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'serif',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  selectedServiceCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  selectedServiceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedServicePrice: {
    fontSize: 16,
    color: '#d4af37',
    fontWeight: 'bold',
    marginTop: 5,
  },
  selectedServiceDuration: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  changeServiceButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  changeServiceText: {
    color: '#d4af37',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectServiceButton: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  selectServiceText: {
    color: '#666',
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedDateButton: {
    backgroundColor: '#d4af37',
  },
  dateText: {
    color: '#666',
    fontSize: 14,
  },
  selectedDateText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
    width: '23%',
    alignItems: 'center',
  },
  selectedTimeButton: {
    backgroundColor: '#d4af37',
  },
  timeText: {
    color: '#666',
    fontSize: 12,
  },
  selectedTimeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stylistCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedStylistCard: {
    borderColor: '#d4af37',
  },
  stylistInfo: {
    flex: 1,
  },
  stylistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stylistSpeciality: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  stylistExperience: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  selectedRadioButton: {
    backgroundColor: '#d4af37',
    borderColor: '#d4af37',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
  },
  summarySection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  summaryPrice: {
    fontSize: 18,
    color: '#d4af37',
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#d4af37',
    margin: 20,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookingScreen;

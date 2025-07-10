import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
} from 'react-native';

const ContactScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const contactInfo = {
    phone: '+91 98765 43210',
    email: 'info@apsaloon.com',
    address: '123 Beauty Street, Fashion District, Mumbai, Maharashtra 400001',
    hours: {
      weekdays: '10:00 AM - 9:00 PM',
      saturday: '10:00 AM - 9:00 PM',
      sunday: '10:00 AM - 5:00 PM',
    },
  };

  const locations = [
    {
      id: 1,
      name: 'AP Saloon - Mumbai Central',
      address: '123 Beauty Street, Fashion District, Mumbai 400001',
      phone: '+91 98765 43210',
      coordinates: { latitude: 19.0760, longitude: 72.8777 },
    },
    {
      id: 2,
      name: 'AP Saloon - Bandra',
      address: '456 Style Avenue, Bandra West, Mumbai 400050',
      phone: '+91 98765 43211',
      coordinates: { latitude: 19.0596, longitude: 72.8295 },
    },
    {
      id: 3,
      name: 'AP Saloon - Andheri',
      address: '789 Glamour Road, Andheri East, Mumbai 400069',
      phone: '+91 98765 43212',
      coordinates: { latitude: 19.1136, longitude: 72.8697 },
    },
  ];

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (emailAddress: string) => {
    Linking.openURL(`mailto:${emailAddress}`);
  };

  const handleWhatsApp = () => {
    const whatsappNumber = '919876543210';
    const message = 'Hello! I would like to book an appointment at AP Saloon.';
    Linking.openURL(`whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`);
  };

  const handleDirections = (location: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.latitude},${location.coordinates.longitude}`;
    Linking.openURL(url);
  };

  const handleSendMessage = () => {
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Here you would typically send the message to your backend
    const messageData = {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    };

    console.log('Message Data:', messageData);

    Alert.alert(
      'Message Sent!',
      'Thank you for your message. We will get back to you soon.',
      [
        {
          text: 'OK',
          onPress: () => {
            setName('');
            setEmail('');
            setMessage('');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <Text style={styles.headerSubtitle}>Get in touch with AP Saloon</Text>
      </View>

      {/* Quick Contact Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleCall(contactInfo.phone)}
        >
          <Text style={styles.actionIcon}>📞</Text>
          <Text style={styles.actionText}>Call Now</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleWhatsApp}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>WhatsApp</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEmail(contactInfo.email)}
        >
          <Text style={styles.actionIcon}>✉️</Text>
          <Text style={styles.actionText}>Email</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <View style={styles.contactItem}>
          <Text style={styles.contactLabel}>Phone:</Text>
          <TouchableOpacity onPress={() => handleCall(contactInfo.phone)}>
            <Text style={styles.contactValue}>{contactInfo.phone}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contactItem}>
          <Text style={styles.contactLabel}>Email:</Text>
          <TouchableOpacity onPress={() => handleEmail(contactInfo.email)}>
            <Text style={styles.contactValue}>{contactInfo.email}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contactItem}>
          <Text style={styles.contactLabel}>Address:</Text>
          <Text style={styles.contactValueMultiline}>{contactInfo.address}</Text>
        </View>
      </View>

      {/* Business Hours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Hours</Text>
        
        <View style={styles.hoursItem}>
          <Text style={styles.hoursDay}>Monday - Friday:</Text>
          <Text style={styles.hoursTime}>{contactInfo.hours.weekdays}</Text>
        </View>
        
        <View style={styles.hoursItem}>
          <Text style={styles.hoursDay}>Saturday:</Text>
          <Text style={styles.hoursTime}>{contactInfo.hours.saturday}</Text>
        </View>
        
        <View style={styles.hoursItem}>
          <Text style={styles.hoursDay}>Sunday:</Text>
          <Text style={styles.hoursTime}>{contactInfo.hours.sunday}</Text>
        </View>
      </View>

      {/* Our Locations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Locations</Text>
        
        {locations.map((location) => (
          <View key={location.id} style={styles.locationCard}>
            <Text style={styles.locationName}>{location.name}</Text>
            <Text style={styles.locationAddress}>{location.address}</Text>
            <Text style={styles.locationPhone}>{location.phone}</Text>
            
            <View style={styles.locationActions}>
              <TouchableOpacity 
                style={styles.locationButton}
                onPress={() => handleCall(location.phone)}
              >
                <Text style={styles.locationButtonText}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.locationButton}
                onPress={() => handleDirections(location)}
              >
                <Text style={styles.locationButtonText}>Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Contact Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send us a Message</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        
        <TextInput
          style={[styles.input, styles.messageInput]}
          placeholder="Your Message"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send Message</Text>
        </TouchableOpacity>
      </View>

      {/* Social Media */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Follow Us</Text>
        
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIcon}>📘</Text>
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIcon}>📷</Text>
            <Text style={styles.socialText}>Instagram</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIcon}>🐦</Text>
            <Text style={styles.socialText}>Twitter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapSection}>
        <Text style={styles.sectionTitle}>Find Us</Text>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>🗺️ Interactive Map</Text>
          <Text style={styles.mapSubtext}>Tap to open in Google Maps</Text>
        </View>
      </View>
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 14,
    color: '#d4af37',
    fontWeight: 'bold',
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
  contactItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  contactLabel: {
    fontSize: 16,
    color: '#666',
    width: 80,
    fontWeight: '500',
  },
  contactValue: {
    fontSize: 16,
    color: '#d4af37',
    fontWeight: 'bold',
    flex: 1,
  },
  contactValueMultiline: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  hoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hoursDay: {
    fontSize: 16,
    color: '#666',
  },
  hoursTime: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  locationCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
  locationPhone: {
    fontSize: 14,
    color: '#d4af37',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  locationButton: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    flex: 0.4,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
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
  messageInput: {
    height: 100,
  },
  sendButton: {
    backgroundColor: '#d4af37',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialButton: {
    alignItems: 'center',
    padding: 10,
  },
  socialIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  socialText: {
    fontSize: 14,
    color: '#666',
  },
  mapSection: {
    padding: 20,
  },
  mapPlaceholder: {
    backgroundColor: '#f0f0f0',
    height: 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  mapText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default ContactScreen;

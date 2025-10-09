import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Key,
  FileText,
  Users,
  Wrench,
  Edit3,
  Link2,
  Mail,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react-native';

export default function GrantInviteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState<'link' | 'direct'>('link');
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'whatsapp'>('email');
  const [message, setMessage] = useState('');

  const vehicleData = {
    brand: 'Honda',
    model: 'Civic',
    plate: 'ABC-1234',
  };

  const relationshipTypes = {
    owner: { title: 'Proprietário', icon: Key },
    renter: { title: 'Locatário', icon: FileText },
    authorized_driver: { title: 'Condutor', icon: Users },
    technical: { title: 'Responsável Técnico', icon: Wrench },
    other: { title: 'Outro', icon: Edit3 },
  };

  const selectedRelationship = relationshipTypes.owner; // This would come from params in real implementation

  const handleGenerateLink = () => {
    // Simulate link generation
    const link = `https://mobistory.app/accept-link/${params.vehicleId}/${Date.now()}`;
    setGeneratedLink(link);
  };

  const handleCopyLink = () => {
    Clipboard.setString(generatedLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSendInvite = () => {
    if (selectedMethod === 'link' && !generatedLink) {
      Alert.alert('Erro', 'Por favor, gere o link primeiro.');
      return;
    }

    if (selectedMethod === 'direct') {
      if (contactMethod === 'email' && !recipientEmail.trim()) {
        Alert.alert('Erro', 'Por favor, informe o e-mail do destinatário.');
        return;
      }
      if (contactMethod === 'whatsapp' && !recipientPhone.trim()) {
        Alert.alert('Erro', 'Por favor, informe o telefone do destinatário.');
        return;
      }
    }

    Alert.alert(
      'Convite enviado!',
      'O convite foi enviado com sucesso.',
      [{ text: 'OK', onPress: () => router.push('/') }]
    );
  };

  const canSubmit = () => {
    if (selectedMethod === 'link') {
      return generatedLink !== '';
    } else {
      if (contactMethod === 'email') {
        return recipientEmail.trim() !== '';
      } else {
        return recipientPhone.trim() !== '';
      }
    }
  };

  const IconComponent = selectedRelationship.icon;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Conceder vínculo</Text>
          <Text style={styles.subtitle}>
            Envie um convite para{' '}
            <Text style={styles.vehicleName}>
              {vehicleData.brand} {vehicleData.model}
            </Text>
          </Text>

          {/* Selected Relationship Type */}
          <View style={styles.relationshipBox}>
            <View style={styles.relationshipBoxHeader}>
              <View style={styles.relationshipBoxIcon}>
                <IconComponent size={20} color={Colors.primary.dark} />
              </View>
              <View style={styles.relationshipBoxInfo}>
                <Text style={styles.relationshipBoxLabel}>Tipo de vínculo</Text>
                <Text style={styles.relationshipBoxTitle}>
                  {selectedRelationship.title}
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.changeButton}>Alterar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Method Selection */}
          <Text style={styles.sectionTitle}>Como enviar o convite?</Text>

          <TouchableOpacity
            onPress={() => setSelectedMethod('link')}
            style={[
              styles.methodCard,
              selectedMethod === 'link' && styles.methodCardSelected,
            ]}
          >
            <View
              style={[
                styles.methodIconBox,
                selectedMethod === 'link' && styles.methodIconBoxSelected,
              ]}
            >
              <Link2
                size={20}
                color={
                  selectedMethod === 'link'
                    ? Colors.background.primary
                    : Colors.text.secondary
                }
              />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Gerar link de convite</Text>
              <Text style={styles.methodDescription}>
                Crie um link e compartilhe como preferir
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedMethod('direct')}
            style={[
              styles.methodCard,
              selectedMethod === 'direct' && styles.methodCardSelected,
            ]}
          >
            <View
              style={[
                styles.methodIconBox,
                selectedMethod === 'direct' && styles.methodIconBoxSelected,
              ]}
            >
              <Mail
                size={20}
                color={
                  selectedMethod === 'direct'
                    ? Colors.background.primary
                    : Colors.text.secondary
                }
              />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Enviar diretamente</Text>
              <Text style={styles.methodDescription}>
                Informe e-mail ou WhatsApp do destinatário
              </Text>
            </View>
          </TouchableOpacity>

          {/* Link Generation */}
          {selectedMethod === 'link' && (
            <View style={styles.linkSection}>
              {!generatedLink ? (
                <TouchableOpacity
                  onPress={handleGenerateLink}
                  style={styles.generateButton}
                >
                  <Link2 size={16} color={Colors.primary.dark} />
                  <Text style={styles.generateButtonText}>Gerar link</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.linkBox}>
                  <View style={styles.linkBoxHeader}>
                    <Link2 size={16} color={Colors.success.dark} />
                    <Text style={styles.linkBoxTitle}>Link gerado com sucesso!</Text>
                  </View>
                  <View style={styles.linkContainer}>
                    <Text style={styles.linkText} numberOfLines={1}>
                      {generatedLink}
                    </Text>
                    <TouchableOpacity
                      onPress={handleCopyLink}
                      style={styles.copyButton}
                    >
                      {linkCopied ? (
                        <Check size={16} color={Colors.success.dark} />
                      ) : (
                        <Copy size={16} color={Colors.primary.dark} />
                      )}
                    </TouchableOpacity>
                  </View>
                  {linkCopied && (
                    <Text style={styles.copiedText}>Link copiado!</Text>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Direct Send */}
          {selectedMethod === 'direct' && (
            <View style={styles.directSection}>
              <View style={styles.contactMethodButtons}>
                <TouchableOpacity
                  onPress={() => setContactMethod('email')}
                  style={[
                    styles.contactMethodButton,
                    contactMethod === 'email' && styles.contactMethodButtonSelected,
                  ]}
                >
                  <Mail
                    size={16}
                    color={
                      contactMethod === 'email'
                        ? Colors.background.primary
                        : Colors.text.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.contactMethodButtonText,
                      contactMethod === 'email' &&
                        styles.contactMethodButtonTextSelected,
                    ]}
                  >
                    E-mail
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setContactMethod('whatsapp')}
                  style={[
                    styles.contactMethodButton,
                    contactMethod === 'whatsapp' &&
                      styles.contactMethodButtonSelected,
                  ]}
                >
                  <MessageCircle
                    size={16}
                    color={
                      contactMethod === 'whatsapp'
                        ? Colors.background.primary
                        : Colors.text.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.contactMethodButtonText,
                      contactMethod === 'whatsapp' &&
                        styles.contactMethodButtonTextSelected,
                    ]}
                  >
                    WhatsApp
                  </Text>
                </TouchableOpacity>
              </View>

              {contactMethod === 'email' ? (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>E-mail do destinatário</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="exemplo@email.com"
                    placeholderTextColor={Colors.text.placeholder}
                    value={recipientEmail}
                    onChangeText={setRecipientEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              ) : (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>WhatsApp do destinatário</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="(00) 00000-0000"
                    placeholderTextColor={Colors.text.placeholder}
                    value={recipientPhone}
                    onChangeText={setRecipientPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              )}
            </View>
          )}

          {/* Optional Message */}
          <View style={styles.messageSection}>
            <Text style={styles.inputLabel}>Mensagem (opcional)</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Adicione uma mensagem personalizada ao convite..."
              placeholderTextColor={Colors.text.placeholder}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              O destinatário receberá um convite para aceitar o vínculo de{' '}
              <Text style={styles.infoBold}>{selectedRelationship.title}</Text> com o
              veículo{' '}
              <Text style={styles.infoBold}>
                {vehicleData.brand} {vehicleData.model}
              </Text>
              .
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleSendInvite}
          style={[styles.sendButton, !canSubmit() && styles.sendButtonDisabled]}
          disabled={!canSubmit()}
        >
          <Text style={styles.sendButtonText}>
            {selectedMethod === 'link' ? 'Concluir' : 'Enviar convite'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  vehicleName: {
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  relationshipBox: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    padding: 16,
    marginBottom: 24,
  },
  relationshipBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  relationshipBoxIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  relationshipBoxInfo: {
    flex: 1,
  },
  relationshipBoxLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  relationshipBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  changeButton: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
    marginBottom: 12,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
    gap: 12,
    marginBottom: 12,
  },
  methodCardSelected: {
    borderColor: Colors.primary.dark,
    backgroundColor: Colors.background.secondary,
  },
  methodIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodIconBoxSelected: {
    backgroundColor: Colors.primary.dark,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  linkSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary.dark,
    borderStyle: 'dashed',
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  linkBox: {
    backgroundColor: Colors.success.light,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.success.dark,
    padding: 16,
  },
  linkBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  linkBoxTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success.dark,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary.dark,
  },
  copyButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.background.tertiary,
  },
  copiedText: {
    fontSize: 12,
    color: Colors.success.dark,
    marginTop: 8,
    textAlign: 'center',
  },
  directSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  contactMethodButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  contactMethodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
  },
  contactMethodButtonSelected: {
    backgroundColor: Colors.primary.dark,
  },
  contactMethodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  contactMethodButtonTextSelected: {
    color: Colors.background.primary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.primary.dark,
  },
  messageSection: {
    marginBottom: 24,
  },
  messageInput: {
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.primary.dark,
    minHeight: 100,
  },
  infoBox: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 12,
    padding: 12,
  },
  infoText: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  infoBold: {
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.DEFAULT,
  },
  sendButton: {
    backgroundColor: Colors.primary.dark,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.background.tertiary,
  },
  sendButtonText: {
    color: Colors.background.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

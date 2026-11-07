import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { IconeCheck, IconeEscudo } from '../../../components/UnbookIcons';

interface PixModalProps {
  visible: boolean;
  onClose: () => void;
  ticketTitle?: string;
  initialAmount?: string;
}

export function PixModal({
  visible,
  onClose,
  ticketTitle = 'Apoiar o UnBook',
  initialAmount = 'R$ 4,50',
}: PixModalProps) {
  const [selectedAmount, setSelectedAmount] = useState(initialAmount);
  const [copied, setCopied] = useState(false);
  const pixKey = 'pix@unbook.com.br';

  useEffect(() => {
    setSelectedAmount(initialAmount);
    setCopied(false);
  }, [initialAmount, visible]);

  const handleCopy = () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(pixKey).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const amountOptions = ['R$ 1,00', 'R$ 4,50', 'R$ 6,10', 'R$ 10,00', 'R$ 25,00'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <View style={styles.pixBadge}>
                <Text style={styles.pixBadgeText}>CHAVE PIX OFICIAL</Text>
              </View>
              <Text style={styles.title}>{ticketTitle}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar modal"
              onPress={onClose}
              style={styles.closeBtn}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Line x1="18" y1="6" x2="6" y2="18" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round" />
                <Line x1="6" y1="6" x2="18" y2="18" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round" />
              </Svg>
            </Pressable>
          </View>

          {/* Opções de Valor Selecionado */}
          <View style={styles.amountSelectorRow}>
            {amountOptions.map((amt) => {
              const isSelected = selectedAmount === amt;
              return (
                <Pressable
                  key={amt}
                  onPress={() => setSelectedAmount(amt)}
                  style={[
                    styles.amountChip,
                    isSelected && styles.amountChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.amountChipText,
                      isSelected && styles.amountChipTextSelected,
                    ]}
                  >
                    {amt}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* QR Code Container */}
          <View style={styles.qrContainer}>
            <View style={styles.qrBox}>
              <Svg width={140} height={140} viewBox="0 0 100 100">
                <Rect x="5" y="5" width="30" height="30" stroke="#1F1F1F" strokeWidth="4" fill="none" />
                <Rect x="12" y="12" width="16" height="16" fill="#1F1F1F" />
                <Rect x="65" y="5" width="30" height="30" stroke="#1F1F1F" strokeWidth="4" fill="none" />
                <Rect x="72" y="12" width="16" height="16" fill="#1F1F1F" />
                <Rect x="5" y="65" width="30" height="30" stroke="#1F1F1F" strokeWidth="4" fill="none" />
                <Rect x="12" y="72" width="16" height="16" fill="#1F1F1F" />
                <Rect x="42" y="10" width="8" height="8" fill="#1F1F1F" />
                <Rect x="52" y="18" width="6" height="14" fill="#1F1F1F" />
                <Rect x="42" y="24" width="6" height="8" fill="#1F1F1F" />
                <Rect x="42" y="42" width="16" height="16" fill="#009A5E" />
                <Rect x="10" y="44" width="8" height="12" fill="#1F1F1F" />
                <Rect x="24" y="46" width="10" height="6" fill="#1F1F1F" />
                <Rect x="65" y="44" width="12" height="8" fill="#1F1F1F" />
                <Rect x="82" y="44" width="10" height="12" fill="#1F1F1F" />
                <Rect x="45" y="66" width="10" height="14" fill="#1F1F1F" />
                <Rect x="62" y="62" width="16" height="8" fill="#1F1F1F" />
                <Rect x="82" y="66" width="10" height="26" fill="#1F1F1F" />
                <Rect x="64" y="76" width="12" height="16" fill="#1F1F1F" />
                <Rect x="42" y="86" width="14" height="6" fill="#1F1F1F" />
              </Svg>
            </View>
            <View style={styles.qrInfo}>
              <Text style={styles.qrValueLabel}>VALOR SUGERIDO</Text>
              <Text style={styles.qrValueText}>{selectedAmount}</Text>
              <Text style={styles.qrHint}>
                Abra o app do seu banco e aponte a câmera para o QR Code ou copie a chave PIX abaixo:
              </Text>
            </View>
          </View>

          {/* Campo Chave PIX com botão Copiar */}
          <View style={styles.keyBox}>
            <View style={styles.keyTextWrapper}>
              <Text style={styles.keyLabel}>CHAVE PIX (E-MAIL)</Text>
              <Text style={styles.keyValue}>{pixKey}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Copiar chave PIX"
              onPress={handleCopy}
              style={[styles.copyBtn, copied && styles.copyBtnSuccess]}
            >
              {copied && <IconeCheck size={14} color="#FFFFFF" />}
              <Text style={[styles.copyBtnText, copied && styles.copyBtnTextSuccess]}>
                {copied ? 'CHAVE COPIADA!' : 'COPIAR CHAVE'}
              </Text>
            </Pressable>
          </View>

          {/* Feedback de transparência sem emojis */}
          <View style={styles.encouragementBox}>
            <View style={styles.encouragementIconBox}>
              <IconeEscudo size={18} color="#009A5E" />
            </View>
            <Text style={styles.encouragementText}>
              <Text style={styles.bold}>Transparência UnBook:</Text> Todo recurso é aplicado na manutenção dos servidores em nuvem, custos de domínio e consumo das APIs de IA acadêmica. Muito obrigado pelo apoio!
            </Text>
          </View>

          {/* Botão de Fechar */}
          <Pressable style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneBtnText}>CONCLUÍDO</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 31, 31, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    padding: 24,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  pixBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#009A5E',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  pixBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    backgroundColor: '#FAF9F5',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  amountSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  amountChip: {
    flex: 1,
    minWidth: 70,
    backgroundColor: '#FAF9F5',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        } as any)
      : {}),
  },
  amountChipSelected: {
    backgroundColor: '#F1C321',
  },
  amountChipText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  amountChipTextSelected: {
    color: '#1F1F1F',
  },
  qrContainer: {
    flexDirection: 'row',
    backgroundColor: '#FCFAEC',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 10,
    padding: 14,
    gap: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  qrBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrInfo: {
    flex: 1,
  },
  qrValueLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#707070',
    letterSpacing: 0.5,
  },
  qrValueText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#009A5E',
    marginBottom: 6,
  },
  qrHint: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 16,
  },
  keyBox: {
    backgroundColor: '#FAF9F5',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  keyTextWrapper: {
    flex: 1,
  },
  keyLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#707070',
    letterSpacing: 0.5,
  },
  keyValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F1F1F',
    marginTop: 2,
  },
  copyBtn: {
    backgroundColor: '#1349EB',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          boxShadow: '2px 2px 0px #1F1F1F',
        } as any)
      : {}),
  },
  copyBtnSuccess: {
    backgroundColor: '#009A5E',
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  copyBtnTextSuccess: {
    color: '#FFFFFF',
  },
  encouragementBox: {
    flexDirection: 'row',
    backgroundColor: '#FAF9F5',
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    borderRadius: 8,
    padding: 12,
    gap: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  encouragementIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#E6F8F0',
    borderWidth: 1.5,
    borderColor: '#009A5E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  encouragementText: {
    flex: 1,
    fontSize: 11.5,
    color: '#555555',
    lineHeight: 16,
  },
  bold: {
    fontWeight: '800',
    color: '#1F1F1F',
  },
  doneBtn: {
    backgroundColor: '#1F1F1F',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          boxShadow: '3px 3px 0px #1F1F1F',
        } as any)
      : {}),
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12.5,
    letterSpacing: 0.8,
  },
});

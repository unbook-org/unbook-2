import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import Svg, { Rect, Path, Line } from 'react-native-svg';
import { theme } from '../../../constants/theme';

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

          {/* Valor Selecionado */}
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
                Abra o app do seu banco e escaneie o QR Code ou copie a chave PIX abaixo:
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
              <Text style={[styles.copyBtnText, copied && styles.copyBtnTextSuccess]}>
                {copied ? '✓ COPIADO!' : 'COPIAR CHAVE'}
              </Text>
            </Pressable>
          </View>

          {/* Feedback ou aviso de incentivo */}
          <View style={styles.encouragementBox}>
            <Text style={styles.encouragementText}>
              ☕ <Text style={styles.bold}>Transparência UnBook:</Text> Todo recurso é usado para cobrir infraestrutura de servidores, custos de domínio e consumo da API de IA acadêmica. Muito obrigado por apoiar os estudantes da UnB!
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
    backgroundColor: 'rgba(31, 31, 31, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#1F1F1F',
    borderRadius: 16,
    padding: 24,
    maxWidth: 540,
    width: '100%',
    shadowColor: '#000000',
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
    backgroundColor: '#009A5E',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    marginBottom: 6,
  },
  pixBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFEDE1',
  },
  amountSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  amountChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    backgroundColor: '#F6F6F5',
  },
  amountChipSelected: {
    backgroundColor: '#F1C321',
    transform: [{ translateY: -2 }],
  },
  amountChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  amountChipTextSelected: {
    fontWeight: '900',
  },
  qrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCFAEC',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    marginBottom: 18,
  },
  qrBox: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
  },
  qrInfo: {
    flex: 1,
  },
  qrValueLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#707070',
    letterSpacing: 0.5,
  },
  qrValueText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#009A5E',
    marginBottom: 6,
  },
  qrHint: {
    fontSize: 12,
    color: '#272725',
    lineHeight: 16,
  },
  keyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F6F6F5',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  keyTextWrapper: {
    flex: 1,
  },
  keyLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#707070',
    marginBottom: 2,
  },
  keyValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F1F1F',
    fontFamily: 'monospace',
  },
  copyBtn: {
    backgroundColor: '#1349EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  copyBtnSuccess: {
    backgroundColor: '#009A5E',
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  copyBtnTextSuccess: {
    color: '#FFFFFF',
  },
  encouragementBox: {
    backgroundColor: '#EFEDE1',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
  },
  encouragementText: {
    fontSize: 12,
    color: '#272725',
    lineHeight: 18,
  },
  bold: {
    fontWeight: '800',
  },
  doneBtn: {
    backgroundColor: '#1F1F1F',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});


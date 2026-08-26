import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { radius, spacing } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { riderService } from '@/services/rider.service';
import { EmergencyContact } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

export default function EmergencyContactsScreen() {
  const { colors } = useTheme();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    riderService.getEmergencyContacts().then(setContacts);
  }, []);

  const add = async () => {
    if (!name || phone.length < 10) return;
    setSaving(true);
    try {
      const c = await riderService.addEmergencyContact({ name, phone, relationship });
      setContacts((cs) => [...cs, c]);
      setName(''); setPhone(''); setRelationship('');
    } finally {
      setSaving(false);
    }
  };

  const remove = (id: string) => {
    Alert.alert('Remove contact?', 'This contact will no longer be notified in emergencies.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await riderService.removeEmergencyContact(id);
          setContacts((cs) => cs.filter((c) => c.id !== id));
        },
      },
    ]);
  };

  return (
    <Screen scroll>
      <Header title="Emergency contacts" subtitle="Up to 5 people who'll be notified when you trigger SOS" />

      {contacts.length === 0 && (
        <Card
          padding="base"
          style={{
            backgroundColor: colors.warningMuted,
            borderColor: colors.warning,
            borderWidth: 1,
            flexDirection: 'row',
            marginBottom: spacing.lg,
          }}
          elevated={false}
        >
          <Ionicons name="alert-circle" size={20} color={colors.warning} style={{ marginRight: 10 }} />
          <Text variant="bodySm" style={{ flex: 1 }}>
            Add at least one contact so someone is alerted the moment you need help.
          </Text>
        </Card>
      )}

      {contacts.map((c, i) => (
        <MotiView key={c.id} from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} delay={i * 60}>
          <Card padding="base" style={{ marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: colors.primaryMuted,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text variant="h4" color="primary">{c.name[0]?.toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="body" style={{ fontWeight: '600' }}>{c.name}</Text>
              <Text variant="bodySm" color="textSecondary">
                {c.phone}{c.relationship ? ` · ${c.relationship}` : ''}
              </Text>
            </View>
            <Pressable
              onPress={() => remove(c.id)}
              hitSlop={10}
              style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: colors.dangerMuted,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Ionicons name="trash" size={16} color={colors.danger} />
            </Pressable>
          </Card>
        </MotiView>
      ))}

      {contacts.length < 5 && (
        <Card padding="lg" style={{ marginTop: spacing.lg }}>
          <Text variant="h4" style={{ marginBottom: spacing.md }}>Add contact</Text>
          <View style={{ gap: spacing.md }}>
            <Input label="Full name" placeholder="e.g. Chidi Okafor" value={name} onChangeText={setName} />
            <Input label="Phone number" placeholder="+234 812 345 6789" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <Input label="Relationship (optional)" placeholder="e.g. Sister" value={relationship} onChangeText={setRelationship} />
            <Button label="Add contact" onPress={add} loading={saving} disabled={!name || phone.length < 10} />
          </View>
        </Card>
      )}
    </Screen>
  );
}

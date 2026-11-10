import { Platform } from 'react-native';

let notificationsPromise = null;

const carregarNotifications = async () => {
  if (Platform.OS === 'web') {
    throw new Error('Lembretes estão disponíveis apenas no aplicativo móvel.');
  }

  if (!notificationsPromise) {
    notificationsPromise = import('expo-notifications').then((Notifications) => {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
      return Notifications;
    });
  }

  return notificationsPromise;
};

export async function agendarLembreteDePrazo(titulo, prazo) {
  const dataPrazo = new Date(prazo);
  const dataLembrete = new Date(dataPrazo.getTime() - 60 * 60 * 1000);

  if (Number.isNaN(dataPrazo.getTime()) || dataLembrete <= new Date()) {
    throw new Error('O prazo precisa estar a mais de uma hora no futuro.');
  }

  const Notifications = await carregarNotifications();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('prazos', {
      name: 'Prazos de atividades',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  let permissao = await Notifications.getPermissionsAsync();
  if (!permissao.granted) {
    permissao = await Notifications.requestPermissionsAsync();
  }
  if (!permissao.granted) {
    throw new Error('Permissão para notificações não concedida.');
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Prazo de atividade chegando',
      body: `"${titulo}" vence em uma hora.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: dataLembrete,
      ...(Platform.OS === 'android' ? { channelId: 'prazos' } : {}),
    },
  });
}

export async function cancelarNotificacaoLocal(notificacaoId) {
  if (!notificacaoId) return;
  const Notifications = await carregarNotifications();
  await Notifications.cancelScheduledNotificationAsync(notificacaoId);
}
import React from 'react';
import { View } from 'react-native';
import { RadiusScope } from '../radius';
import type { IconComponent } from './icon';
import { Text, type TextTone } from './text';

// Встроенное сообщение в потоке страницы (не окно): «нет связи с сервером», «мод несовместим».
// Фон — цвет смысла с прозрачностью, как у Pill. Карточка rounded-xl p-1: действия справа
// прилегают к её краю и по правилу радиусов получают 12 − 4 = 8 (rounded-lg, Button сам
// берёт его из RadiusScope); текстовая часть отступает дальше — px-2.5 py-2

export type AlertTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

// Классы целиком — иначе Uniwind их не найдёт при сборке
const BACKGROUND: Record<AlertTone, string> = {
  info: 'bg-blue-500/10',
  success: 'bg-green-500/10',
  // Жёлтый светлее остальных — чуть плотнее, чтобы фон читался
  warning: 'bg-amber-500/15',
  danger: 'bg-red-500/10',
  neutral: 'bg-mist-200 dark:bg-mist-800',
};

const ACCENT: Record<AlertTone, TextTone> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  neutral: 'default',
};

const ICON_CLASS: Record<AlertTone, string> = {
  info: 'text-blue-600 dark:text-blue-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-amber-600 dark:text-amber-400',
  danger: 'text-red-600 dark:text-red-400',
  neutral: 'text-mist-500 dark:text-mist-400',
};

export interface AlertProps {
  tone?: AlertTone;
  icon?: IconComponent;
  title?: string;
  /** Пояснение: строка — абзацем, иначе как есть */
  children?: React.ReactNode;
  /** Действия справа: Button, IconButton — радиус по правилу из карточки */
  action?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  tone = 'info',
  icon: Icon,
  title,
  children,
  action,
  className = '',
}) => (
  <RadiusScope radius="xl" padding="1">
    <View
      // Предупреждение и ошибку диктор зачитывает сразу, остальное — как статус
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
      className={`flex-row items-center gap-1 p-1 rounded-xl ${BACKGROUND[tone]} ${className}`}
    >
      <View className="flex-1 flex-row items-start gap-2.5 px-2.5 py-2">
        {Icon && (
          <View className="h-5 justify-center">
            <Icon size={16} className={ICON_CLASS[tone]} />
          </View>
        )}
        <View className="flex-1 gap-0.5">
          {title ? (
            <Text weight="semibold" tone={ACCENT[tone]}>
              {title}
            </Text>
          ) : null}
          {typeof children === 'string' || typeof children === 'number' ? (
            <Text size="xs" tone="secondary" className="leading-5">
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      </View>
      {action ? <View className="flex-row gap-1">{action}</View> : null}
    </View>
  </RadiusScope>
);

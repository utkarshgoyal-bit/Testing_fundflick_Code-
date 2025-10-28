import { cn } from '@/lib/utils';
import { useTranslation, Trans } from 'react-i18next';

const I8nTextWrapper = ({ text, className }: { text: string; className?: string }) => {
  const { t } = useTranslation();
  return (
    <Trans i18nKey={text} className={cn(className)}>
      {t(text)}
    </Trans>
  );
};

export default I8nTextWrapper;

import { useCallback } from 'react';
import { useCameraStore } from '../stores/cameraStore';
import { identifyPlant } from '../services/plantnet';
import { getErrorMessage } from '../utils/errors';
import * as Haptics from 'expo-haptics';

export function usePlantIdentification() {
  const {
    capturedImage,
    selectedOrgan,
    setIsIdentifying,
    setResults,
    setError,
    setShowOrganSelector,
  } = useCameraStore();

  const identify = useCallback(async () => {
    if (!capturedImage) return;

    setShowOrganSelector(false);
    setIsIdentifying(true);
    setError(null);
    setResults(null);

    try {
      const results = await identifyPlant(capturedImage, selectedOrgan);
      setResults(results);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsIdentifying(false);
    }
  }, [capturedImage, selectedOrgan, setIsIdentifying, setResults, setError, setShowOrganSelector]);

  return { identify };
}

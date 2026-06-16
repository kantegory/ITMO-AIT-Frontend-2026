import { ref } from 'vue';
import { createApplication, getApplications } from '../services/api';

export function useApplications() {
  const applications = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref('');

  async function fetchApplications(userEmail) {
    if (!userEmail) {
      applications.value = [];
      return;
    }

    loading.value = true;
    error.value = '';

    try {
      applications.value = await getApplications({ userEmail });
    } catch (requestError) {
      console.error(requestError);
      error.value = 'Не удалось загрузить заявки с JSON Server.';
    } finally {
      loading.value = false;
    }
  }

  function hasApplied(taskId, roleLabel) {
    return applications.value.some((application) => (
      Number(application.taskId) === Number(taskId) && application.roleLabel === roleLabel
    ));
  }

  async function applyToPosition(task, position, user) {
    if (!task || !position || !user || hasApplied(task.id, position.roleLabel)) {
      return false;
    }

    saving.value = true;
    error.value = '';

    try {
      const createdApplication = await createApplication({
        taskId: task.id,
        taskTitle: task.title,
        roleLabel: position.roleLabel,
        status: task.status,
        priority: task.priority,
        image: task.image,
        createdBy: task.createdBy.name,
        userEmail: user.email,
        userName: `${user.name} ${user.surname}`
      });

      applications.value.push(createdApplication);
      return true;
    } catch (requestError) {
      console.error(requestError);
      error.value = 'Не удалось сохранить заявку через API.';
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    applications,
    loading,
    saving,
    error,
    fetchApplications,
    hasApplied,
    applyToPosition
  };
}

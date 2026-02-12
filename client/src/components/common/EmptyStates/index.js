export { default as EmptyState } from '../EmptyState';
export * from '../EmptyStateIllustrations';

// Pre-configured empty states for common scenarios
import React from 'react';
import EmptyState from '../EmptyState';
import {
  NoTasksIllustration,
  NoRequestsIllustration,
  NoNotificationsIllustration,
  NoResultsIllustration,
  ConnectionErrorIllustration,
} from '../EmptyStateIllustrations';
import { PlusCircle, RefreshCw, Search, Inbox, ListTodo } from 'lucide-react';

export const EmptyTasksState = ({ onCreateTask }) => (
  <EmptyState
    illustration={<NoTasksIllustration />}
    title="No Tasks Yet"
    description="You haven't created any tasks yet. Start by posting your first task and connect with helpers in your community."
    actionLabel="Create Your First Task"
    onAction={onCreateTask}
  />
);

export const EmptyMyTasksState = ({ onCreateTask }) => (
  <EmptyState
    icon={ListTodo}
    title="No Tasks Posted"
    description="You haven't posted any tasks yet. Create a task to get help from the community."
    actionLabel="Post a Task"
    onAction={onCreateTask}
  />
);

export const EmptyRequestsState = () => (
  <EmptyState
    illustration={<NoRequestsIllustration />}
    title="No Requests Yet"
    description="You haven't received any help requests for your tasks. Once people see your tasks, you'll get requests here."
  />
);

export const EmptyMyRequestsState = ({ onBrowseTasks }) => (
  <EmptyState
    icon={Inbox}
    title="No Requests Sent"
    description="You haven't requested to help with any tasks yet. Browse available tasks and send requests to get started."
    actionLabel="Browse Tasks"
    onAction={onBrowseTasks}
  />
);

export const EmptyNotificationsState = () => (
  <EmptyState
    illustration={<NoNotificationsIllustration />}
    title="No Notifications"
    description="You're all caught up! You'll be notified here when someone requests your help or responds to your requests."
  />
);

export const EmptySearchResultsState = ({ searchQuery, onClearSearch }) => (
  <EmptyState
    illustration={<NoResultsIllustration />}
    title="No Results Found"
    description={
      searchQuery
        ? `No tasks found matching "${searchQuery}". Try different keywords or browse all tasks.`
        : "No tasks match your search. Try adjusting your filters."
    }
    actionLabel="Clear Search"
    onAction={onClearSearch}
  />
);

export const ConnectionErrorState = ({ onRetry }) => (
  <EmptyState
    illustration={<ConnectionErrorIllustration />}
    title="Connection Error"
    description="Unable to load data. Please check your internet connection and try again."
    actionLabel="Retry"
    onAction={onRetry}
  />
);

export const LoadingState = () => (
  <EmptyState
    icon={RefreshCw}
    title="Loading..."
    description="Please wait while we fetch your data."
  />
);

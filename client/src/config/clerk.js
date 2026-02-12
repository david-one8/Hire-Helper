export const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  appearance: {
    baseTheme: undefined,
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#ffffff',
      colorInputBackground: '#ffffff',
      colorInputText: '#1f2937',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '0.5rem',
    },
    elements: {
      card: 'shadow-xl',
      formButtonPrimary: 'bg-primary-600 hover:bg-primary-700',
      footerActionLink: 'text-primary-600 hover:text-primary-700',
    },
  },
  localization: {
    userProfile: {
      navbar: {
        title: 'Account',
        description: 'Manage your account settings',
      },
    },
  },
};

export default clerkConfig;

# Toggle Component

A reusable iOS-style toggle switch component with optional label and description text.

## Features

- iOS-inspired design with smooth animations
- Support for label and description text
- Flexible positioning (toggle on left or right)
- Fully accessible with proper ARIA attributes
- TypeScript support with type safety
- Forward ref support for form libraries

## Usage

### Basic Toggle

```tsx
import Toggle from "@/components/common/Toggle";

function Example() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Toggle
      id="basic-toggle"
      checked={enabled}
      onChange={(e) => setEnabled(e.target.checked)}
    />
  );
}
```

### Toggle with Label

```tsx
<Toggle
  id="notifications"
  checked={notificationsEnabled}
  onChange={(e) => setNotificationsEnabled(e.target.checked)}
  label="Enable Notifications"
/>
```

### Toggle with Label and Description

```tsx
<Toggle
  id="recurring"
  checked={recurringEnabled}
  onChange={handleToggle}
  label="Your Recurring Days"
  description="Add the weekdays and time slots for your recurring job."
/>
```

### Toggle on Left Side

```tsx
<Toggle
  id="exact-timing"
  checked={exactTiming}
  onChange={handleToggle}
  label="Exact timing required ?"
  description="Enable this if the job must start at an exact time."
  togglePosition="left"
/>
```

## Props

| Prop                    | Type                  | Default   | Description                                    |
| ----------------------- | --------------------- | --------- | ---------------------------------------------- |
| `id`                    | `string`              | Required  | Unique identifier for the toggle               |
| `checked`               | `boolean`             | -         | Controls the toggle state                      |
| `onChange`              | `function`            | -         | Callback function when toggle state changes    |
| `label`                 | `string`              | -         | Label text displayed above the toggle          |
| `description`           | `string`              | -         | Description text displayed below the label     |
| `error`                 | `string`              | -         | Error message to display                       |
| `disabled`              | `boolean`             | `false`   | Disables the toggle                            |
| `wrapperClassName`      | `string`              | -         | Additional CSS class for wrapper               |
| `labelClassName`        | `string`              | -         | Additional CSS class for label                 |
| `descriptionClassName`  | `string`              | -         | Additional CSS class for description           |
| `togglePosition`        | `'left' \| 'right'`   | `'right'` | Position of the toggle relative to text        |
| `className`             | `string`              | -         | Additional CSS class for the input element     |

## Styling

The component uses the `.apple-toggle-wrap` CSS class defined in `globals.css`. The toggle features:

- Smooth slide animation
- iOS-style green color (#15994b) when checked
- Focus ring for keyboard accessibility
- Disabled state styling

## Accessibility

- Uses semantic HTML with proper label association
- Supports keyboard navigation
- Includes focus indicators
- Works with screen readers

## Notes

- The component forwards refs, making it compatible with form libraries like React Hook Form
- All standard HTML input attributes are supported via the spread operator
- The toggle inherits all checkbox functionality while providing a custom visual appearance

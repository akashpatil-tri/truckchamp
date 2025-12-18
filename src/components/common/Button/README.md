# Button Component Documentation

## Overview
A fully reusable, type-safe Button component that can render as either a button or Next.js Link with consistent styling and behavior.

## Features
- ✅ TypeScript discriminated unions for type safety
- ✅ Next.js Link integration
- ✅ Multiple variants (filled, outline, ghost, link, none)
- ✅ Three sizes (sm, md, lg)
- ✅ Loading states with spinner
- ✅ Icon support (left or right positioning)
- ✅ Full accessibility (ARIA attributes)
- ✅ Disabled states
- ✅ Full width option
- ✅ Forward refs support

---

## Usage Examples

### Basic Button
```tsx
import Button from "@/components/common/Button";

<Button onClick={handleClick}>Click me</Button>
```

### Submit Button with Loading State
```tsx
<Button 
  type="submit" 
  variant="filled" 
  isLoading={isPending}
>
  Submit Form
</Button>
```

### Link Button (Next.js Link)
```tsx
<Button 
  as="link" 
  href="/dashboard" 
  variant="outline"
>
  Go to Dashboard
</Button>
```

### External Link
```tsx
<Button 
  as="link" 
  href="https://example.com" 
  target="_blank"
  variant="filled"
>
  Visit Website
</Button>
```

### Button with Icon
```tsx
import { Plus } from "lucide-react";

<Button 
  icon={<Plus size={16} />} 
  iconPosition="left"
  variant="filled"
>
  Add Item
</Button>
```

### Different Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
```

### Different Variants
```tsx
<Button variant="filled">Filled (default)</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="none">None</Button>
```

### Full Width Button
```tsx
<Button fullWidth variant="filled">
  Full Width Button
</Button>
```

### Disabled Button
```tsx
<Button isDisabled>Disabled Button</Button>
```

### With Custom Class
```tsx
<Button className="custom-class" variant="filled">
  Custom Styled
</Button>
```

### With ARIA Label
```tsx
<Button 
  ariaLabel="Close dialog" 
  icon={<X />}
  variant="ghost"
/>
```

---

## Props API

### Common Props (BaseButtonProps)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `title` | `string` | - | Button text (alternative to children) |
| `icon` | `ReactNode` | - | Icon element to display |
| `iconPosition` | `"left" \| "right"` | `"right"` | Position of the icon |
| `variant` | `ButtonVariant` | `"filled"` | Visual style variant |
| `size` | `ButtonSize` | `"md"` | Button size |
| `isDisabled` | `boolean` | `false` | Disabled state |
| `isLoading` | `boolean` | `false` | Loading state with spinner |
| `children` | `ReactNode` | - | Button content |
| `id` | `string` | - | HTML id attribute |
| `fullWidth` | `boolean` | `false` | Makes button full width |
| `ariaLabel` | `string` | - | Accessibility label |

### Button-Specific Props (ButtonAsButton)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `"button"` | `"button"` | Render as button element |
| `type` | `"submit" \| "reset" \| "button"` | `"button"` | Button type |
| `onClick` | `MouseEventHandler` | - | Click handler |

### Link-Specific Props (ButtonAsLink)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `"link"` | - | Render as Next.js Link |
| `href` | `string` | - | Link destination (required) |
| `target` | `"_blank" \| "_self" \| "_parent" \| "_top"` | - | Link target |
| `rel` | `string` | - | Link relationship |

---

## Variants

### `filled` (default)
Solid background button, primary action style.

### `outline`
Outlined button with transparent background.

### `ghost`
Minimal button with no border, background on hover.

### `link`
Styled as a text link.

### `none`
No default styling, fully custom.

---

## Sizes

### `sm` (Small)
Compact button for tight spaces.

### `md` (Medium - Default)
Standard button size.

### `lg` (Large)
Larger button for emphasis.

---

## CSS Classes

The component generates the following CSS classes that you can style:

```css
/* Base */
.btn { }

/* Variants */
.btn--filled { }
.btn--outline { }
.btn--ghost { }
.btn--link { }
.btn--none { }

/* Sizes */
.btn--sm { }
.btn--md { }
.btn--lg { }

/* States */
.btn--loading { }
.btn--disabled { }
.btn--full-width { }

/* Icon positioning */
.btn--icon-left { }
.btn--icon-right { }

/* Content elements */
.btn__content { }
.btn__icon { }
.btn__icon--left { }
.btn__icon--right { }
.btn__spinner { }
.btn__spinner-dot { }
```

---

## TypeScript

The component uses discriminated unions for type safety:

```typescript
// When as="button", you get button props
<Button 
  as="button"  // or omit (default)
  onClick={handler}  // ✅ Available
  href="/path"       // ❌ TypeScript error
/>

// When as="link", you get link props
<Button 
  as="link"
  href="/path"       // ✅ Required
  onClick={handler}  // ❌ TypeScript error
/>
```

---

## Accessibility

The component includes proper ARIA attributes:
- `aria-disabled` for disabled state
- `aria-busy` for loading state
- `aria-label` for custom labels
- Prevents click events when disabled or loading

---

## Migration from Old Button

### Old API → New API

```tsx
// OLD
<Button 
  isLink={true}
  href="/path"
  buttonRef={ref}
  isIconFirst={true}
  parentClassName="wrapper"
  titleClassName="text"
/>

// NEW
<Button 
  as="link"
  href="/path"
  ref={ref}
  iconPosition="left"
  className="wrapper"  // Apply to button directly
/>
```

### Breaking Changes
- `isLink` → `as="link"`
- `isIconFirst` → `iconPosition="left"`
- `buttonRef` → `ref` (use React.forwardRef)
- `parentClassName` → removed (use `className` directly)
- `titleClassName` → removed (use `className` for custom styling)
- `isActive` → removed (use `className` for active state)
- `style` → removed (use `className` instead)

# OTP Input Animation Component

## Overview

Create an animated OTP (One-Time Password) input component in [Task2Page.tsx](src/pages/Task2Page.tsx) using the Motion library. The component will feature 6 input boxes (3-3 layout with dash separator), animated focus highlight, error shake, and success icon transition.

## Component Structure

```
[Icon Circle - Email/Lock]
      |
[___] [___] [___] - [___] [___] [___]
```

## Key Files

- [src/pages/Task2Page.tsx](src/pages/Task2Page.tsx) - Main implementation
- [src/components/task2/OTPInput.tsx](src/components/task2/OTPInput.tsx) - Optional: Extract component

## Animation Implementation

### 1. Moving Highlight Border

Use Motion's `layoutId` for shared element animation:

- Create an absolutely positioned border element that moves between inputs
- Apply `layoutId="otp-highlight"` so it smoothly animates between positions
- Border color: blue (default) / red (error state)

### 2. Digit Entry Animation (bottom to top fade)

When a digit is entered, animate it into view:

```jsx
<motion.span
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: "spring", duration: 0.3 }}
>
  {digit}
</motion.span>
```

### 3. Error Shake Animation

When code is incorrect (not "123456"):

- Change highlight color from blue to red
- Animate highlight back from last to first input
- Apply horizontal shake to all boxes:
```jsx
animate={{ x: [0, -10, 10, -10, 10, 0] }}
transition={{ duration: 0.4 }}
```


### 4. Icon Circle Animation

- Default: Email icon (from `lucide-react`)
- On success: Bounce animation + fade transition to Lock icon
- Use `AnimatePresence` for icon crossfade:
```jsx
<motion.div
  animate={isSuccess ? { scale: [1, 1.2, 1] } : {}}
  transition={{ type: "spring" }}
>
  <AnimatePresence mode="wait">
    {isSuccess ? (
      <motion.div key="lock" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
        <Lock />
      </motion.div>
    ) : (
      <motion.div key="mail" exit={{ opacity: 0, scale: 0.5 }}>
        <Mail />
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>
```


## State Management

- `digits: string[]` - Array of 6 digits
- `focusedIndex: number` - Currently focused input (0-5)
- `status: 'idle' | 'error' | 'success'` - Current state
- `isShaking: boolean` - For shake animation trigger

## Styling (Tailwind)

- Light theme only
- Input boxes: rounded corners, subtle border, centered text
- Focus highlight: 2px solid blue border (or red on error)
- Icon circle: rounded-full background with centered icon
- Dash separator between 3rd and 4th inputs

## Flow

1. User types digits (only numbers allowed)
2. Auto-focus moves to next input after entry
3. After 6th digit:

   - If "123456": success state, show lock icon with bounce
   - If incorrect: error state, shake boxes, highlight moves back to start

4. After success: stay in locked state

## Todos

- [ ] Create OTPInput component with 6 input boxes and state management
- [ ] Implement moving highlight border with layoutId animation
- [ ] Add digit entry animation (fade from bottom to top)
- [ ] Implement error state: shake animation and highlight color change
- [ ] Create icon circle with bounce and crossfade animation on success


---
title: WCAG
tags:
  - Accessibility
  - WAI-ARIA
type: Approach
---

WCAG is specification which describes how much is our web accessible. IT has 3 levels (A, AA and AAA) of accessibility which we can achieve.

What is required for each level can be found at [https://www.w3.org/WAI/WCAG21/quickref/](https://www.w3.org/WAI/WCAG21/quickref/)

## A level

Filtered out on w3.org

[https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_overview&levels=aa%2Caaa#principle1](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_overview&levels=aa%2Caaa#principle1)

- All non-text content has text alternatives
    - `img` element has `alt=””` attribute etc…
- Provide alternatives for time-based media
    - Provide equivalent for audio, for example text description of what is happening
    - Provide either audio track or text description of what is happening
    - Exception is, if the media itself is alternative for something
- Provide captions
    - Provide captions for all audio content in synchronized media
    - Exception is if the media itself is alternative for something
- Provide descriptions
    - Description is available for all
- Information and relationship in presentation can be determined or is available in text
    - This means that the page uses roles to identify some parts which should be logically together. This is achieved by using role attributes
    - See examples [here at w3.org](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_overview&levels=aa%2Caaa#adaptable)
- Meaningful sequence
    - If the sequence in which the content is presented matters, it can be programmatically determined
    - This means that the order in DOM is as close as is the result on screen
- Sensory characteristics
    - Provide more information for the user as to what to do
    - This can mean that we tell the user where the thing he is supposed to do is
    - We can use shape, color, size, visual location etc. to more precisely navigate the user where we want him
- Use of color
    - We use color to visually differentiate meaning of some text or shapes
    - This can mean that we label invalid fields in red, valid in green. But also that in tables we differentiate between heading and content etc…
- Audio control
    - If some audio plays for more than 3 seconds, user should be able to pause it, or to mute it, independently from system volume
- Keyboard
    - All the content is operable through keyboard interface without any requirements for specific timing
- No keyboard trap
    - If we can access some component with a keyboard, we can also move away from that component
    - If there is some non standard method required to move away, we inform the user how to do it
- Character key shortcuts
    - If there is any shortcut implemented on the site, then one of the following is true:
        - Turn off - we can turn it of
        - Remap - we can remap the shortcut
        - Active only on focus - it is active only on component focus
- Timing adjustable
    - For more information on time limits go to [w3.org site section 2.2.1](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_overview&levels=aa%2Caaa&showtechniques=221#timing-adjustable) and see “techniques and failures for 2.2.1” and search for specific situation you are facing
    - For each time limit set by content at least one of the following is true:
        - Turn off - time limit can be turn of
        - Adjust - time limit can be adjusted
        - Extend - user is given at least 20 seconds before expiry, and can prolong it simply and at least 10 times
        - Real-time exception - there is no way to prolong the time (for example in auction)
        - Essential exception - the time limit is essential and extending it would invalidate the activity
        - 20 hour exception - the time limit is longer than 20 hours
    - Each exception defines when we can not prolong the time limit
- Pause, stop, hide
    - If we have content which is automatically updating (scrolling, moving etc…) for more than 5 seconds user should be able to pause, stop or hide it
    - Moving, blinking, scrolling
        - for any content that starts automatically for more than 5 seconds and is presented in parallel with other content, user should be able to pause, stop or hide it
    - Auto-updating
        - for auto-updating information that starts automatically and is presented with other content, user should be able to pause, stop or hide it
    - Exception is, if it is essential part of some activity
- Three Flashes or below threshold
    - Web should not contain element that flashes more than 3 times a second, or the flash should be below the red flash thresholds
- Bypass blocks
    - There should be mechanism to bypass blocks of content that is repeated on multiple web pages
- Page titled
    - Page should have meaningful title which should describe topic and purpose
- Focus order
    - If page can be navigated sequentially and the navigation sequence affects meaning or operation, we should focus in a way that preserves meaning and operability
- Link Purpose (In context)
    - The purpose of each link should be determinable from the link itself, or from the text associated with the link
- Pointer Gestures
    - Functionality which uses multipoint or path-based gestures should be operable with single pointer without a path-based gesture
- Pointer cancellation
    - For functionality using single pointer at least one of the following must be satisfied
        - no down-event - we do not use down-event to execute any part of the function
        - abort or undo - Completion is on up-event, and user is able to abort the function (esc key for example) before completion or to undo after completion
        - up reversal - up-event reverses any outcome of preceding down-event
        - essential - completing the function on down-event is essential
- Label in name
    - For UI components with labels with text or image of text, the name contains text that is presented visually
    - This means that is we ask for name in input, we don’t label it email for example. Or if image contains the writing “CAT” we don’t label it “DOGS”
- Motion actuation
    - Functionality that can use device motion or user motion can also be operated by UI components and responding to the motion can be disabled.
    - Exception are when
        - supported interface - The motion is used to operate functionality through an accessibility interface
        - essential - The motion is essential and would invalidate the activity
- Language
    - The default human language can be programmatically determined
    - This usually means that we include `lang` tag in `html` element
- On focus
    - If UI element receives focus, it does not initiate context change
    - For this purpose is usually used onClick or other events. Binding onFocus is usually a bad idea
- On Input
    - Changing setting of any UI component doesn’t automatically trigger context change, unless user has been advised of this behavior in advanced
    - This means again that if user selects for example radio checkbox we don’t change the context of the page. Or if user types something in the input it doesn’t change the context of the page.
    - For this functionality we have buttons or form submissions
- Error identification
    - If there is input error detected, the item that the error is for is identified, and the error is described using text
- Label or instructions
    - Labels or instructions are provided when content required user input
    - This means using `label` element for inputs, or labeling the input with `aria-describedby`
- Parsing
    - in markup languages (like HTML is) elements:
        - have complete start and end tags,
        - are nested according to their specifications,
        - don’t contain duplicate attributes (tags), and any IDs are unique.
    - There are some specifications exceptions for this, where one or more rules can be omit
    - We don’t care for this usually, because React would throw exception while building the web if we somehow manage to not follow one of this requirements
- Name, role, value
    - For all UI components, the name and role can be programmatically determined.
    - States, properties, and values that can be set by user, can be programmatically set and notification of changes to these items is available to user agents, including assistive technologies

## AA level

All that is required for A level and what is written here:

[https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=a%2Caaa#principle1](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=a%2Caaa#principle1)

## AAA level

All that is required for AA level, and what is written here:

[https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=a%2Caa#principle1](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=a%2Caa#principle1)

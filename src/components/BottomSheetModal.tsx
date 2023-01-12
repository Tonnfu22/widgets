import { Trans } from '@lingui/macro'
import { globalFontStyles } from 'css/font'
import { forwardRef, PropsWithChildren, useState } from 'react'
import { createPortal } from 'react-dom'
import styled, { keyframes } from 'styled-components/macro'

import Dialog, { Animation, Header, Modal, Provider as DialogProvider } from './Dialog'

const slideInBottom = keyframes`
  from {
    transform: translateY(calc(100vh));
  }
`

const slideOutBottom = keyframes`
  to {
    transform: translateY(100%);
  }
`

const BottomSheetModalBackdrop = styled.div<{ className?: string }>`
  background-color: ${({ theme }) => theme.scrim};
  bottom: 0;
  left: 0;
  opacity: 1;
  position: fixed;
  right: 0;

  &.hidden {
    opacity: 0;
    transition: visibility 0s linear 0.25s, opacity 0.25s;
    visibility: hidden;
  }

  top: 0;
  transition: visibility 0s linear 0s, opacity 0.25s;
  visibility: visible;
`

const Wrapper = styled.div<{ open: boolean }>`
  ${globalFontStyles};

  border-radius: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  overflow: hidden;
  width: 100%;

  @supports (overflow: clip) {
    overflow: clip;
  }

  ${Modal} {
    animation: ${slideInBottom} 0.25s ease-in;
    border-bottom-left-radius: 0;

    &.${Animation.CLOSING} {
      animation: ${slideOutBottom} 0.25s ease-out;
    }

    border-bottom-right-radius: 0;
    bottom: 0;
    box-shadow: ${({ theme }) => theme.deepShadow};
    height: unset;
    position: fixed;
    top: unset;
  }
`

type BottomSheetModalProps = PropsWithChildren<{
  onClose: () => void
  open: boolean
  title: string
}>

export function BottomSheetModal({ children, onClose, open, title }: BottomSheetModalProps) {
  const [rootWrapper, setRootWrapper] = useState<HTMLDivElement | null>(null)

  return (
    <>
      <RootElement ref={setRootWrapper} open={open} />
      <DialogProvider value={rootWrapper}>
        {open && (
          <Dialog color="dialog" onClose={onClose}>
            <>
              <Header title={<Trans>{title}</Trans>} />
              {children}
            </>
          </Dialog>
        )}
      </DialogProvider>
    </>
  )
}

type RootElementProps = PropsWithChildren<{
  open: boolean
}>

const RootElement = forwardRef<HTMLDivElement, RootElementProps>(function RootWrapper(
  { children, open }: RootElementProps,
  ref
) {
  return createPortal(
    <>
      {/* TODO (WEB-2767): Support dismissing modal when clicking on backdrop */}
      <BottomSheetModalBackdrop className={!open ? 'hidden' : undefined} />
      <Wrapper open={open} ref={ref}>
        {children}
      </Wrapper>
    </>,
    document.body
  )
})

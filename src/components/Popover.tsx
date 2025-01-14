import { Options, Placement } from '@popperjs/core'
import maxSize from 'popper-max-size-modifier'
import React, { createContext, useContext, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePopper } from 'react-popper'
import styled from 'styled-components/macro'
import { Layer } from 'theme'

const BoundaryContext = createContext<HTMLDivElement | null>(null)

/* Defines a boundary component past which a Popover should not overflow. */
export const PopoverBoundaryProvider = BoundaryContext.Provider

const PopoverContainer = styled.div<{ show: boolean }>`
  background-color: ${({ theme }) => theme.dialog};
  border: 1px solid ${({ theme }) => theme.outline};
  border-radius: 0.5em;
  opacity: ${(props) => (props.show ? 1 : 0)};
  padding: 10px 12px;
  transition: visibility 0.25s linear, opacity 0.25s linear;
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  z-index: ${Layer.TOOLTIP};
`

const Reference = styled.div`
  display: inline-block;
  height: 1em;
`

const Arrow = styled.div`
  height: 8px;
  width: 8px;
  z-index: ${Layer.TOOLTIP};

  ::before {
    background: ${({ theme }) => theme.dialog};
    border: 1px solid ${({ theme }) => theme.outline};
    content: '';
    height: 8px;
    position: absolute;
    transform: rotate(45deg);
    width: 8px;
  }

  &.arrow-top {
    bottom: -4px;
    ::before {
      border-radius: 1px;
      border-left: none;
      border-top: none;
    }
  }

  &.arrow-bottom {
    top: -5px; // includes -1px from border
    ::before {
      border-bottom: none;
      border-right: none;
      border-radius: 1px;
    }
  }

  &.arrow-left {
    right: -4px;
    ::before {
      border-bottom: none;
      border-left: none;
      border-radius: 1px;
    }
  }

  &.arrow-right {
    left: -5px; // includes -1px from border
    ::before {
      border-radius: 1px;
      border-right: none;
      border-top: none;
    }
  }
`

export interface PopoverProps {
  content: React.ReactNode
  show: boolean
  children: React.ReactNode
  placement: Placement
  offset?: number
  contained?: true
  showArrow?: boolean
}

export default function Popover({
  content,
  show,
  children,
  placement,
  offset,
  contained,
  showArrow = true,
}: PopoverProps) {
  const boundary = useContext(BoundaryContext)
  const reference = useRef<HTMLDivElement>(null)

  // Use callback refs to be notified when instantiated
  const [popover, setPopover] = useState<HTMLDivElement | null>(null)
  const [arrow, setArrow] = useState<HTMLDivElement | null>(null)

  const options = useMemo((): Options => {
    const modifiers: Options['modifiers'] = [
      { name: 'offset', options: { offset: [0, offset || 4] } },
      { name: 'arrow', options: { element: arrow, padding: 4 } },
    ]
    if (contained) {
      modifiers.push(
        { name: 'preventOverflow', options: { boundary, padding: 8 } },
        { name: 'flip', options: { boundary, padding: 8 } },
        { ...maxSize, options: { boundary, padding: 8 } },
        {
          name: 'applyMaxSize',
          enabled: true,
          phase: 'beforeWrite',
          requires: ['maxSize'],
          fn({ state }) {
            const { width } = state.modifiersData.maxSize
            // width is sometimes too small, so expand it to the clientWidth:
            const maxWidth = Math.max(width, (boundary?.clientWidth ?? 16) - 16)
            state.styles.popper = {
              ...state.styles.popper,
              maxWidth: `${maxWidth}px`,
            }
          },
        }
      )
    }
    return {
      placement,
      strategy: 'absolute',
      modifiers,
    }
  }, [offset, arrow, contained, placement, boundary])

  const { styles, attributes } = usePopper(reference.current, popover, options)

  return (
    <>
      <Reference ref={reference}>{children}</Reference>
      {boundary &&
        createPortal(
          <PopoverContainer show={show} ref={setPopover} style={styles.popper} {...attributes.popper}>
            {content}
            {showArrow && (
              <Arrow
                className={`arrow-${attributes.popper?.['data-popper-placement'] ?? ''}`}
                ref={setArrow}
                style={styles.arrow}
                {...attributes.arrow}
              />
            )}
          </PopoverContainer>,
          boundary
        )}
    </>
  )
}

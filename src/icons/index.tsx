import { ReactComponent as RouterIcon } from 'assets/svg/auto_router.svg'
import { ReactComponent as CheckIcon } from 'assets/svg/check.svg'
import { ReactComponent as ExpandoIcon } from 'assets/svg/expando.svg'
import { ReactComponent as GasIcon } from 'assets/svg/gasIcon.svg'
import { ReactComponent as LogoIcon } from 'assets/svg/logo.svg'
import { ReactComponent as ReverseIcon } from 'assets/svg/reverse.svg'
import { ReactComponent as SpinnerIcon } from 'assets/svg/spinner.svg'
import { ReactComponent as WalletIcon } from 'assets/svg/wallet.svg'
import { ReactComponent as WalletDisconnectIcon } from 'assets/svg/wallet_disconnect.svg'
import { FunctionComponent, SVGProps } from 'react'
// This file wraps react-feather, so its import is intentional.
/* eslint-disable no-restricted-imports */
import { Icon as FeatherIcon } from 'react-feather'
import {
  AlertTriangle as AlertTriangleIcon,
  ArrowDown as ArrowDownIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  ArrowUp as ArrowUpIcon,
  ArrowUpRight as ArrowUpRightIcon,
  BarChart2 as BarChart2Icon,
  CheckCircle as CheckCircleIcon,
  ChevronDown as ChevronDownIcon,
  Clock as ClockIcon,
  HelpCircle as HelpCircleIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Slash as SlashIcon,
  Trash2 as Trash2Icon,
  X as XIcon,
  XOctagon as XOctagonIcon,
} from 'react-feather'
/* eslint-enable no-restricted-imports */
import styled, { css, keyframes } from 'styled-components/macro'
import { Color } from 'theme'

import IdenticonIcon from './identicon'

type SVGIcon = FunctionComponent<SVGProps<SVGSVGElement>>

function icon(Icon: FeatherIcon | SVGIcon) {
  return styled(Icon)<{ color?: Color }>`
    clip-path: stroke-box;
    height: 1em;
    stroke: ${({ color = 'currentColor', theme }) => theme[color]};
    width: 1em;
  `
}

export const largeIconCss = css<{ iconSize: number }>`
  display: flex;

  svg {
    align-self: center;
    height: ${({ iconSize }) => iconSize}em;
    width: ${({ iconSize }) => iconSize}em;
  }
`

const LargeWrapper = styled.div<{ iconSize: number }>`
  height: 1em;
  width: ${({ iconSize }) => iconSize}em;
  ${largeIconCss}
`

export type Icon = ReturnType<typeof icon> | typeof LargeIcon

interface LargeIconProps {
  icon?: Icon
  color?: Color
  size?: number
  className?: string
}

export function LargeIcon({ icon: Icon, color, size = 1.2, className }: LargeIconProps) {
  return (
    <LargeWrapper color={color} iconSize={size} className={className}>
      {Icon && <Icon color={color} />}
    </LargeWrapper>
  )
}

export const AlertTriangle = icon(AlertTriangleIcon)
export const ArrowDown = icon(ArrowDownIcon)
export const ArrowRight = icon(ArrowRightIcon)
export const ArrowLeft = icon(ArrowLeftIcon)
export const ArrowUp = icon(ArrowUpIcon)
export const CheckCircle = icon(CheckCircleIcon)
export const BarChart = icon(BarChart2Icon)
export const ChevronDown = icon(ChevronDownIcon)
export const Clock = icon(ClockIcon)
export const HelpCircle = icon(HelpCircleIcon)
export const Identicon = icon(IdenticonIcon)
export const Info = icon(InfoIcon)
export const AutoRouter = icon(RouterIcon)
export const Settings = icon(SettingsIcon)
export const Slash = icon(SlashIcon)
export const Trash2 = icon(Trash2Icon)
export const Wallet = icon(WalletIcon)
export const X = icon(XIcon)
export const XOctagon = icon(XOctagonIcon)
export const Reverse = icon(ReverseIcon)
export const ArrowUpRight = icon(ArrowUpRightIcon)

export const Check = styled(icon(CheckIcon))`
  circle {
    fill: ${({ theme }) => theme.active};
    stroke: none;
  }
`

export const Expando = styled(icon(ExpandoIcon))<{ open: boolean }>`
  .left,
  .right {
    transition: transform 0.25s ease-in-out;
    will-change: transform;
  }

  .left {
    transform: ${({ open }) => (open ? undefined : 'translateX(-25%)')};
  }

  .right {
    transform: ${({ open }) => (open ? undefined : 'translateX(25%)')};
  }
`

export const Logo = styled(icon(LogoIcon))`
  fill: ${({ theme }) => theme.secondary};
  stroke: none;
`

export const WalletDisconnect = styled(icon(WalletDisconnectIcon))<{ color?: Color }>`
  fill: currentColor;
  stroke: none;
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const Spinner = styled(icon(SpinnerIcon))<{ color?: Color }>`
  animation: 2s ${rotate} linear infinite;
  fill: ${({ color = 'primary', theme }) => theme[color]};
  stroke: ${({ color = 'primary', theme }) => theme[color]};
`

export const Gas = styled(icon(GasIcon))<{ color?: Color }>`
  stroke: ${({ color = 'active', theme }) => theme[color]};
`

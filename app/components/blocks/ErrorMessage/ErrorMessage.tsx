import React, { FC, useEffect } from 'react'
import { View, Text } from 'react-native'

interface ErrorMessageProps {
	isVisible: boolean
	message: string
	onClose: () => void
}

const ErrorMessage: FC<ErrorMessageProps> = ({
	isVisible,
	message,
	onClose
}) => {
	useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(() => {
				onClose()
			}, 2000)

			return () => {
				clearTimeout(timer)
			}
		}
	}, [isVisible, onClose])

	return (
		isVisible && (
			<View
				style={{
					position: 'absolute',
					zIndex: 100000,
					borderColor: 'red',
					borderWidth: 1,
					padding: 20
				}}
				className='w-full justify-center items-center bg-slate-100 bottom-1/3 rounded-lg'
			>
				<Text style={{ color: 'red' }}>{message}</Text>
			</View>
		)
	)
}

export default ErrorMessage

// ImagePickerExample.tsx

import React, { FC, useState, useEffect } from 'react'
import { View, Button, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

interface ImagePickerExampleProps {
	isVisible: boolean
	onClose: () => void
}

const ImagePickerExample: FC<ImagePickerExampleProps> = ({
	isVisible,
	onClose
}) => {
	const [selectedImage, setSelectedImage] = useState(null)

	useEffect(() => {
		;(async () => {
			const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
			if (status !== 'granted') {
				console.log('Sorry, we need camera roll permissions to make this work!')
			}
		})()
	}, [])

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		})

		if (!result.canceled) {
			//@ts-ignore
			setSelectedImage(result.uri)
		}
	}

	useEffect(() => {
		if (isVisible) {
			pickImage() // Вызываем pickImage сразу при отображении ImagePicker
		}
	}, [isVisible])

	useEffect(() => {
		if (selectedImage) {
			onClose()
		}
	}, [selectedImage, onClose])

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
				display: isVisible ? 'flex' : 'none'
			}}
		>
			{selectedImage && (
				<Image
					source={{ uri: selectedImage }}
					style={{ width: 200, height: 200 }}
				/>
			)}
		</View>
	)
}

export default ImagePickerExample

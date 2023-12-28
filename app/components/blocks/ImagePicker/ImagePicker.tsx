import React, { FC, useState, useEffect } from 'react'
import { View, Button, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

interface ImagePickerExampleProps {
	isVisible: boolean
	onClose: () => void
	onImagePick: (imageUri: string) => void // Callback function to handle image pick
}

const ImagePickerExample: FC<ImagePickerExampleProps> = ({
	isVisible,
	onClose,
	onImagePick
}) => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null)

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
			//@ts-ignore
			onImagePick(result.uri) // Notify the parent component about the selected image
		}
	}

	useEffect(() => {
		if (isVisible) {
			pickImage() // Call pickImage when the component is visible
		}
	}, [isVisible])

	useEffect(() => {
		if (selectedImage) {
			onClose()
		}
	}, [selectedImage])

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
				display: isVisible ? 'flex' : 'none'
			}}
		></View>
	)
}

export default ImagePickerExample

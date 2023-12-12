// ContactPicker.tsx
import React, {
	useState,
	useEffect,
	forwardRef,
	useImperativeHandle
} from 'react'
import { Image, View, Text, TouchableOpacity } from 'react-native'
import * as Contacts from 'expo-contacts'

export interface Contact {
	id: string
	name: string
	image: string | undefined
	phoneNumbers?: { number: string }[]
}

export interface ContactPickerRef {
	pickContact: () => Promise<void>
	onClose: () => void
}

const ContactPicker: React.ForwardRefRenderFunction<
	ContactPickerRef,
	{ onClose: () => void }
> = (props, ref) => {
	const [contacts, setContacts] = useState<Contact[]>([])
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

	useEffect(() => {
		const requestContacts = async () => {
			const { status } = await Contacts.requestPermissionsAsync()
			if (status === 'granted') {
				const { data } = await Contacts.getContactsAsync({
					fields: [
						Contacts.Fields.ID,
						Contacts.Fields.Name,
						Contacts.Fields.Image,
						Contacts.Fields.PhoneNumbers
					]
				})

				if (data) {
					const formattedContacts = data.map(contact => ({
						id: contact.id,
						name: contact.name ?? 'Unknown',
						image: contact.image ? contact.image.uri : 'Unknown',
						phoneNumbers: contact.phoneNumbers
					}))
					//@ts-ignore
					setContacts(formattedContacts)
				}
			}
		}

		requestContacts()
	}, [])

	const pickContact = async () => {
		const { status } = await Contacts.requestPermissionsAsync()
		if (status === 'granted') {
			const { data } = await Contacts.getContactsAsync({
				fields: [
					Contacts.Fields.ID,
					Contacts.Fields.Name,
					Contacts.Fields.Image,
					Contacts.Fields.PhoneNumbers
				]
			})

			if (data && data.length > 0) {
				const contact = data[0]
				setSelectedContact({
					id: contact.id,
					name: contact.name ?? 'Unknown',
					image: contact.image ? contact.image.uri : 'Unknown',
					//@ts-ignore
					phoneNumbers: contact.phoneNumbers
				})
			}
		}
	}

	useImperativeHandle(ref, () => ({
		pickContact,
		onClose: props.onClose
	}))

	console.log(selectedContact)

	return (
		<View
			style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
			className='absolute w-full bottom-0 h-full z-50 flex-col justify-end'
		>
			<View className='w-full bg-white bottom-0 h-5/6 z-50 rounded-t-2xl rounded-tr-2xl p-4'>
				<TouchableOpacity onPress={props.onClose}>
					<Text>Закрыть</Text>
				</TouchableOpacity>
				{selectedContact ? (
					<TouchableOpacity className='border-b-2 pt-2 pb-2'>
						<Image
							source={{ uri: selectedContact.image }}
							className='w-4 h-4'
						/>
						<Text>Contact Name: {selectedContact.name}</Text>
						{selectedContact.phoneNumbers && (
							<Text>
								Phone Number: {selectedContact.phoneNumbers[0]?.number}
							</Text>
						)}
					</TouchableOpacity>
				) : (
					<Text className='text-gray-400 text-center'>
						Не удалось найти контакты
					</Text>
				)}
			</View>
		</View>
	)
}

export default forwardRef(ContactPicker)

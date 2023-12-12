// ContactPicker.tsx
import React, {
	useState,
	useEffect,
	forwardRef,
	useImperativeHandle
} from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import * as Contacts from 'expo-contacts'
import MeetingsComponent from '../MeetingsComponent/MeetingsComponent'
//@ts-ignore
import Image from 'react-native-remote-svg'
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
	const [isLoading, setIsLoading] = useState<boolean>(true)

	useEffect(() => {
		setIsLoading(true)
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
						image: contact.image ? contact.image.uri : undefined,
						phoneNumbers: contact.phoneNumbers
					}))
					//@ts-ignore
					setContacts(formattedContacts)
					setIsLoading(false)
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
					image: contact.image ? contact.image.uri : undefined,
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

	console.log(contacts)
	console.log(selectedContact)

	return (
		<>
			{!selectedContact ? (
				<View
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
					className='absolute w-full bottom-0 h-full z-50 flex-col justify-end'
				>
					<View className='w-full bg-white bottom-0 h-5/6 z-50 rounded-t-2xl rounded-tr-2xl p-4'>
						<View className='flex-row w-full justify-between items-center'>
							<Text className='text-center w-full text-lg font-bold'>
								Контакты
							</Text>
							<TouchableOpacity
								onPress={props.onClose}
								className='absolute right-0 z-10'
							>
								<Text>Отменить</Text>
							</TouchableOpacity>
						</View>
						{isLoading ? (
							<Image
								source={require('../../../images/Icons/loading.svg')}
								className={'w-full justify-center h-7'}
							/>
						) : (
							<ScrollView>
								{contacts ? (
									contacts.map(item => {
										return (
											<TouchableOpacity
												className='border-b-2 pt-2 pb-2 flex-row items-center'
												onPress={() => {}}
											>
												<Image
													source={
														item.image
															? { uri: item.image }
															: require('../../../images/defaultSource.png')
													}
													className='w-12 h-12 rounded-full mr-3'
												/>
												<View>
													<Text>{item.name}</Text>
													{item.phoneNumbers && (
														<Text>{item.phoneNumbers[0]?.number}</Text>
													)}
												</View>
											</TouchableOpacity>
										)
									})
								) : (
									<Text className='text-gray-400 text-center'>
										Не удалось найти контакты
									</Text>
								)}
							</ScrollView>
						)}
					</View>
				</View>
			) : (
				<MeetingsComponent />
			)}
		</>
	)
}

export default forwardRef(ContactPicker)

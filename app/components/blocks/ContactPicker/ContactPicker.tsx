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
import UserApiRequest from '@/api/User/Users'

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
	const [searchContacts, setSearchContacts] = useState<Contact[]>([])
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const userApi = new UserApiRequest()

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
					const uniquePhoneNumbers = new Set<string>()
					const formattedContacts = data.reduce((acc: Contact[], contact) => {
						if (contact.phoneNumbers) {
							contact.phoneNumbers.forEach(phoneNumber => {
								const formattedNumber = formatPhoneNumber(phoneNumber.number)
								if (!uniquePhoneNumbers.has(formattedNumber)) {
									uniquePhoneNumbers.add(formattedNumber)
									acc.push({
										id: contact.id,
										name: contact.name ?? 'Unknown',
										image: contact.image ? contact.image.uri : undefined,
										phoneNumbers: [{ number: formattedNumber }]
									})
								}
							})
						}
						return acc
					}, [])
					setContacts(formattedContacts)
					setIsLoading(false)
				}
			}
		}

		requestContacts()
	}, [])

	useEffect(() => {
		const formattedPhoneNumbers = Array.from(
			new Set(
				contacts.flatMap(item =>
					item.phoneNumbers
						? item.phoneNumbers.map(phoneNumber =>
								formatPhoneNumber(phoneNumber.number)
						  )
						: []
				)
			)
		)

		if (formattedPhoneNumbers.length !== 0) {
			userApi.phones(formattedPhoneNumbers).then(resp => {
				//@ts-ignore
				setSearchContacts(resp.data)
			})
		}
	}, [contacts])

	const pickContact = (item: any) => {
		// const { status } = await Contacts.requestPermissionsAsync()
		// if (status === 'granted') {
		// 	const { data } = await Contacts.getContactsAsync({
		// 		fields: [
		// 			Contacts.Fields.ID,
		// 			Contacts.Fields.Name,
		// 			Contacts.Fields.Image,
		// 			Contacts.Fields.PhoneNumbers
		// 		]
		// 	})

		// 	if (data && data.length > 0) {
		// 		const contact = data[0]
		setSelectedContact({
			id: item.id,
			name: item.name ?? 'Unknown',
			image: item.image ? item.image.uri : undefined,
			//@ts-ignore
			phoneNumbers: item.phoneNumbers
		})
		console.log('====================================')
		console.log('pic', item)
		console.log('====================================')
		// 	}
		// }
	}

	// useImperativeHandle(ref, () => ({
	// 	pickContact,
	// 	onClose: props.onClose
	// }))

	const formatPhoneNumber = (phoneNumber: any) => {
		const numericOnly = phoneNumber.replace(/\D/g, '')
		const formattedNumber = numericOnly.replace(
			/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
			'+$1 $2 $3-$4-$5'
		)
		return formattedNumber
	}

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
								source={{ uri: 'https://svgshare.com/i/11gW.svg' }}
								className={'w-full justify-center h-16'}
							/>
						) : (
							<ScrollView>
								<Text className='text-center w-full text-xs'>
									Твои друзья уже в wewell!
								</Text>
								{contacts && Array.isArray(searchContacts) ? (
									contacts.map(item => {
										// Ensure that item.phoneNumbers is defined and has at least one element
										if (item.phoneNumbers && item.phoneNumbers.length > 0) {
											const formattedPhoneNumber = formatPhoneNumber(
												item.phoneNumbers[0]?.number
											)

											return (
												searchContacts.includes(formattedPhoneNumber) && (
													<TouchableOpacity
														key={item.id} // Add a unique key for each mapped element
														className={`border-b-2 border-gray-100 pt-2 pb-2 flex-row items-center`}
														onPress={() => pickContact(item)}
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
															<Text>{formattedPhoneNumber}</Text>
														</View>
													</TouchableOpacity>
												)
											)
										} else {
											// Handle the case where phoneNumbers is undefined or empty
											return null
										}
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
				<MeetingsComponent
					selectedContact={selectedContact}
					onClose={() => setSelectedContact(null)}
				/>
			)}
		</>
	)
}

export default forwardRef(ContactPicker)

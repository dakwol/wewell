import MeetingApiRequest from '@/api/Meeting/Meeting'
import UserApiRequest from '@/api/User/Users'
import { useAuth } from '@/hooks/useAuth'
import { IUser } from '@/types/user.interface'
import { useNavigation } from '@react-navigation/native'
import React, { FC, Fragment, useEffect, useState } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	ScrollView,
	Animated
} from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

export interface Contact {
	id: string
	name: string
	image: string | undefined
	phoneNumbers?: { number: string }[]
}

interface MeetingsComponentProps {
	selectedContact: Contact | null
	onClose: () => void
}
interface IDataMeeting {
	creatorId: number
	guestId: number
	date: string
	minPrice: number
	maxPrice: number
	minDurationHours: number
	maxDurationHours: number
	typeId: number
}

const MeetingsComponent: FC<MeetingsComponentProps> = ({
	selectedContact,
	onClose
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [userSearch, setUserSearch] = useState<any>()
	const userApi = new UserApiRequest()
	const meetingApi = new MeetingApiRequest()
	const { user } = useAuth()
	const [selectedDateIsNow, setSelectedDateIsNow] = useState(
		new Date().toISOString()
	)

	const [selectedDate, setSelectedDate] = useState(undefined)
	const [datePickerVisible, setDatePickerVisible] = useState(false)

	const [selectedMeeting, setSelectedMeeting] = useState<any>(null)
	const [selectedAmount, setSelectedAmount] = useState<any>(null)
	const [selectedDuration, setSelectedDuration] = useState<any>(null)
	const navigation = useNavigation()

	const showDatePicker = () => {
		setDatePickerVisible(true)
	}

	const hideDatePicker = () => {
		setDatePickerVisible(false)
	}

	const handleConfirm = (date: any) => {
		setSelectedDate(date)
		hideDatePicker()
	}

	useEffect(() => {
		userApi
			.getUserPhones(
				selectedContact?.phoneNumbers && selectedContact?.phoneNumbers[0].number
			)
			.then(resp => {
				setUserSearch(resp.data)
			})
	}, [selectedContact])

	const dataMeetin = [
		{
			id: 1,
			text: 'Романтическая'
		},
		{
			id: 2,
			text: 'Дружеская'
		},
		{
			id: 3,
			text: 'Деловая'
		}
	]

	const amountOptions = [
		{
			id: 1,
			text: '0 - 500₽',
			minPrice: 0,
			maxPrice: 500
		},
		{
			id: 2,
			text: '500 - 1500₽',
			minPrice: 500,
			maxPrice: 1500
		},
		{
			id: 3,
			text: '1500 - 2500₽',
			minPrice: 1500,
			maxPrice: 2500
		}
	]
	const durationOptions = [
		{
			id: 1,
			text: '1 час',
			minDurationHours: 0,
			maxDurationHours: 1
		},
		{
			id: 2,
			text: '1 - 2 часа',
			minDurationHours: 1,
			maxDurationHours: 2
		},
		{
			id: 3,
			text: '> 3 часов',
			minDurationHours: 3,
			maxDurationHours: 5
		}
	]

	const [dataMeeting, setDataMeeting] = useState<IDataMeeting>({
		creatorId: user?.user?.id,
		guestId: userSearch?.id,
		date: selectedDate ? selectedDate : selectedDateIsNow,
		minPrice: selectedAmount ? selectedAmount.minPrice : 0,
		maxPrice: selectedAmount ? selectedAmount.maxPrice : 0,
		minDurationHours: selectedDuration ? selectedDuration.minDurationHours : 0,
		maxDurationHours: selectedDuration ? selectedDuration.maxDurationHours : 0,
		typeId: selectedMeeting ? selectedMeeting?.id : 0
	})

	const updateDataMeeting = () => {
		setDataMeeting(prevData => ({
			...prevData,
			guestId: userSearch?.id,
			date: selectedDate //@ts-ignore
				? selectedDate?.toISOString()
				: selectedDateIsNow,
			minPrice: selectedAmount ? selectedAmount.minPrice : 0,
			maxPrice: selectedAmount ? selectedAmount.maxPrice : 0,
			minDurationHours: selectedDuration
				? selectedDuration.minDurationHours
				: 0,
			maxDurationHours: selectedDuration
				? selectedDuration.maxDurationHours
				: 0,
			typeId: selectedMeeting ? selectedMeeting.id : 0
		}))
	}

	useEffect(() => {
		// Обновление dataMeeting при изменении любого из свойств
		updateDataMeeting()
	}, [
		selectedDate,
		selectedAmount,
		selectedDuration,
		selectedMeeting,
		userSearch
	])

	const createMeeting = () => {
		meetingApi.create({ body: dataMeeting }).then(resp => {
			if (resp.success) {
				console.log('respCreate', resp.data)
				//@ts-ignore
				navigation.navigate('Invite', { dataInvite: resp.data })
				onClose()
			}
		})
	}

	const renderButtons = (
		options: any[],
		selectedOption: null,
		setSelectedOption: {
			(value: React.SetStateAction<null>): void
			(value: React.SetStateAction<null>): void
			(arg0: any): void
		}
	) => {
		return options.map(
			(option: {
				id: React.Key | null | undefined
				text: string | undefined | null
			}) => (
				<TouchableOpacity
					key={option.id}
					// style={[styles.button, selectedOption === option.id && styles.selected]}
					style={{ borderWidth: 1 }}
					onPress={() => setSelectedOption(option)}
					className={`pt-2 pb-2 pr-4 pl-4 bg-gray-100 rounded-2xl items-center border-gray-100 ${
						//@ts-ignore
						selectedOption?.id === option.id && 'border-blue-600'
					}`}
				>
					<Text
						className={`text-gray-400 ${
							//@ts-ignore
							selectedOption?.id === option.id && 'text-blue-600'
						}`}
					>
						{option.text}
					</Text>
				</TouchableOpacity>
			)
		)
	}

	return (
		<View
			style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
			className='absolute w-full bottom-0 h-full z-50 flex-col justify-end'
		>
			<View className='w-full bg-white bottom-0 h-5/6 z-50 rounded-t-2xl rounded-tr-2xl p-4'>
				<View className='flex-row w-full justify-between items-center'>
					<Text className='text-start w-full text-2xl font-bold'>
						Новая встреча
					</Text>
					<TouchableOpacity
						className='absolute right-0 z-10'
						onPress={() => onClose()}
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
					<Fragment>
						<ScrollView className='mt-4 '>
							<View className='flex flex-row items-center gap-11'>
								<View
									style={{
										flexDirection: 'column',
										justifyContent: 'space-between',
										height: 105
									}}
								>
									<Animated.Image
										source={{
											//@ts-ignore
											uri: userSearch?.url
										}}
										style={{
											width: 80,
											height: 80,
											borderWidth: 2,
											borderColor: '#0038FF'
										}}
										className={'rounded-full object-cove'}
									/>
									<Text className='text-center w-full text-xs'>
										{userSearch?.name}
									</Text>
								</View>
								<View className='flex-col gap-1'>
									{/* {dataMeetin.map(item => {
										return (
											<TouchableOpacity
												key={item.id}
												className='pt-2 pb-2 pr-4 pl-4 bg-gray-100 rounded-2xl items-center'
											>
												<Text className='text-gray-400'>{item.name}</Text>
											</TouchableOpacity>
										)
									})} */}
									{renderButtons(
										dataMeetin,
										selectedMeeting,
										setSelectedMeeting
									)}
								</View>
							</View>
							<View>
								<Text className='text-start w-full text-2xl font-bold mb-4 mt-5'>
									Введите параметры
								</Text>

								<View>
									<Text className='text-lg font-bold'>Дата</Text>
									<Text className='text-sm text-gray-400'>
										Когда организовать встречу?
									</Text>

									<View className='flex-row gap-3 mt-1 mb-3'>
										<TouchableOpacity
											style={{ borderWidth: 1 }}
											className={`pt-2 pb-2 pr-4 pl-4 w-32 bg-gray-100 rounded-2xl border-gray-100 items-center ${
												selectedDate === undefined && 'border-blue-600'
											}`}
											onPress={() => {
												setSelectedDate(undefined)
											}}
										>
											<Text
												className={`text-gray-400 ${
													selectedDate === undefined && 'text-blue-600'
												}`}
											>
												Сейчас
											</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={{ borderWidth: 1 }}
											className={`pt-2 pb-2 pr-4 pl-4 w-32 border-gray-100 bg-gray-100 rounded-2xl items-center ${
												selectedDate && 'border-blue-600'
											}`}
											onPress={showDatePicker}
										>
											<Text
												className={`text-gray-400 ${
													selectedDate && 'text-blue-600'
												}`}
											>
												{selectedDate
													? //@ts-ignore
													  selectedDate?.toLocaleDateString()
													: 'Выбрать дату'}
											</Text>
										</TouchableOpacity>
										<DateTimePickerModal
											date={selectedDate}
											isVisible={datePickerVisible}
											mode='datetime'
											onConfirm={handleConfirm}
											onCancel={hideDatePicker}
										/>
									</View>
								</View>
								<View className='mb-3'>
									<Text className='text-lg font-bold'>Сумма</Text>
									<Text className='text-sm text-gray-400'>
										Сколько ты готов потратить средств за встречу?
									</Text>

									<ScrollView
										horizontal={true}
										className='flex-row gap-3 mt-1 overflow-scroll pb-3'
										showsHorizontalScrollIndicator={false} // Set to false to hide the horizontal scrollbar
										showsVerticalScrollIndicator={false}
									>
										{renderButtons(
											amountOptions,
											selectedAmount,
											setSelectedAmount
										)}
										{/* {amountOptions.map((option, index) => (
											<Button key={index} text={option} />
										))} */}
									</ScrollView>
								</View>
								<View className='mb-3'>
									<Text className='text-lg font-bold'>Продолжительность</Text>
									<Text className='text-sm text-gray-400'>
										Сколько у тебя есть времени на встречу?
									</Text>

									<ScrollView
										horizontal={true}
										className='flex-row gap-3 mt-1 overflow-scroll pb-3'
										showsHorizontalScrollIndicator={false} // Set to false to hide the horizontal scrollbar
										showsVerticalScrollIndicator={false}
									>
										{renderButtons(
											durationOptions,
											selectedDuration,
											setSelectedDuration
										)}
										{/* {durationOptions.map((option, index) => (
											<Button key={index} text={option} />
										))} */}
									</ScrollView>
								</View>
							</View>
						</ScrollView>
						<TouchableOpacity
							className='w-full bg-blue-700 pt-3 pb-3 pr-20 pl-20 rounded-3xl justify-center flex items-center'
							onPress={() => {
								createMeeting()
							}}
						>
							<Text className='text-white text-base'>Отправить инвайт</Text>
						</TouchableOpacity>
					</Fragment>
				)}
			</View>
		</View>
	)
}

export default MeetingsComponent

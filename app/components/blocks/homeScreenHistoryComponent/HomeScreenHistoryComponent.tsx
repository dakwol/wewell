import React, { FC, Fragment } from 'react'
import { Text, View, Image, Animated, TouchableOpacity } from 'react-native'
import { useAuth } from '@/hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import { dateUtils } from '@/components/UI/functions/functions'
import { SimpleLineIcons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import MeetingApiRequest from '@/api/Meeting/Meeting'
import { useDispatch, useSelector } from 'react-redux'

interface HistoryItem {
	guest: any
	id: number
	name: string
	image: any
	status: string // Add the 'status' property to the HistoryItem interface
}

interface HomeScreenHistoryComponentProps {
	data: HistoryItem[]
	scrollY: Animated.Value
}

const MeetingCard: FC<{ item: HistoryItem; isMy: boolean }> = ({
	item,
	isMy
}) => {
	const navigation = useNavigation()
	const meetingApi = new MeetingApiRequest()
	//@ts-ignore
	const forceUpdate = useSelector(state => state.updateReducer.forceUpdate)

	const dispatch = useDispatch()

	const completeInvite = () => {
		const dataMeeting = {
			id: item.id,
			status: 'Cancelled',
			isActive: false,
			isShowForCreator: false,
			isShowForGuest: false
		}
		meetingApi
			.update({ urlParams: String(item.id), body: dataMeeting })
			.then(resp => {
				if (resp.success) {
					dispatch({ type: 'SET_FORCE_UPDATE', payload: !forceUpdate })
				}
			})
	}

	const renderMeetingContent = () => {
		switch (item.status) {
			case 'Invited': //@ts-ignore
				if (!item.isArchive) {
					return (
						<TouchableOpacity
							onPress={
								//@ts-ignore
								() => navigation.navigate('Invite', { dataInvite: item })
							}
							className={`w-full flex-row rounded-3xl pt-4 pb-4 pl-6 pr-6 justify-between  ${
								isMy
									? 'bg-gray-100 border-blue-600'
									: 'bg-blue-600 border-blue-600'
							}`}
							style={{ borderWidth: 2 }}
						>
							<View className='flex-row'>
								<Animated.Image
									source={
										isMy
											? item.guest && item.guest.url
												? {
														//@ts-ignore
														uri: item.guest.url
												  }
												: require('../../../images/icon.png')
											: //@ts-ignore
											  item.creator && item.creator.url
											  ? {
														//@ts-ignore
														uri: item.creator.url
											    }
											  : require('../../../images/icon.png')
									}
									style={{
										width: 46,
										height: 48
									}}
									className={'rounded-full object-cover border-blue-400'}
								/>
								<View className='ml-5 flex-col justify-center'>
									<Text
										className={`text-base font-bold ${
											isMy ? 'text-black' : 'text-white'
										}`}
									>
										{
											//@ts-ignore
											isMy
												? //@ts-ignore
												  item.guest && item.guest.name
												: //@ts-ignore
												  item.creator && item.creator.name
										}
									</Text>
									<Text
										className={`text-base ${
											isMy ? 'text-black' : 'text-white'
										}`}
									>
										{
											//@ts-ignore
											isMy ? 'Отправлен инвайт' : 'Новый инвайт'
										}
									</Text>
								</View>
							</View>
							<View className='flex-row items-center'>
								<View className='ml-5 flex-col justify-center items-end mr-3'>
									<Text
										className={`text-base ${
											isMy ? 'text-black' : 'text-white'
										}`}
									>
										{/*@ts-ignore */}
										{dateUtils.formatDateWithDayOfWeek(item.date)}
									</Text>
									<Text
										className={`text-base ${
											isMy ? 'text-black' : 'text-white'
										}`}
									>
										{/*@ts-ignore */}
										{dateUtils.extractTimeFromDateTime(item.date)}
									</Text>
								</View>
								{isMy ? (
									<SimpleLineIcons name='arrow-right' size={24} color='black' />
								) : (
									<SimpleLineIcons name='arrow-right' size={24} color='white' />
								)}
							</View>
						</TouchableOpacity>
					)
				}
			case 'Cancelled':
				//@ts-ignore
				if (!item.isArchive) {
					return (
						<TouchableOpacity
							onPress={() => {
								//@ts-ignore
								navigation.navigate('Invite', { dataInvite: item })
							}}
							className={
								'w-full flex-row rounded-3xl pt-4 pb-4 pl-6 pr-6 justify-between border-red-600'
							}
							style={{ borderWidth: 2 }}
						>
							<View className='flex-row'>
								<Animated.Image
									source={
										isMy
											? item.guest && item.guest.url
												? {
														//@ts-ignore
														uri: item.guest.url
												  }
												: require('../../../images/icon.png')
											: //@ts-ignore
											  item.creator && item.creator.url
											  ? {
														//@ts-ignore
														uri: item.creator.url
											    }
											  : require('../../../images/icon.png')
									}
									style={{
										width: 46,
										height: 48
									}}
									className={'rounded-full object-cover border-red-600'}
								/>
								<View className='ml-5 flex-col justify-center'>
									<Text className='text-base font-bold'>
										{
											//@ts-ignore
											isMy
												? //@ts-ignore
												  item.guest && item.guest.name
												: //@ts-ignore
												  item.creator && item.creator.name
										}
									</Text>
									<Text className='text-base'>Инвайт отклонён</Text>
								</View>
							</View>
							<TouchableOpacity
								className='flex-row items-center'
								onPress={() => {
									completeInvite()
								}}
							>
								<AntDesign name='close' size={24} color='black' />
							</TouchableOpacity>
						</TouchableOpacity>
					)
				}
			case 'Waiting':
				//@ts-ignore
				if (!item.isArchive) {
					return (
						<TouchableOpacity
							onPress={
								//@ts-ignore
								() => navigation.navigate('Invite', { dataInvite: item })
							}
						>
							<Animated.Image
								source={
									isMy
										? item.guest && item.guest.url
											? {
													//@ts-ignore
													uri: item.guest.url
											  }
											: require('../../../images/icon.png')
										: //@ts-ignore
										  item.creator && item.creator.url
										  ? {
													//@ts-ignore
													uri: item.creator.url
										    }
										  : require('../../../images/icon.png')
								}
								style={{
									width: 80,
									height: 80,
									borderWidth: 2,
									borderColor: 'blue'
								}}
								className={'rounded-full object-cover border-blue-400'}
							/>
							<Text className='text-center mt-2'>
								{
									//@ts-ignore
									isMy
										? //@ts-ignore
										  item.guest && item.guest.name
										: //@ts-ignore
										  item.creator && item.creator.name
								}
							</Text>
						</TouchableOpacity>
					)
				}

			default:
				return (
					<TouchableOpacity
						onPress={
							//@ts-ignore
							() => navigation.navigate('ProfileMeeting', { dataInvite: item })
						}
					>
						<Animated.Image
							source={
								isMy
									? item.guest && item.guest.url
										? {
												//@ts-ignore
												uri: item.guest.url
										  }
										: require('../../../images/icon.png')
									: //@ts-ignore
									  item.creator && item.creator.url
									  ? {
												//@ts-ignore
												uri: item.creator.url
									    }
									  : require('../../../images/icon.png')
							}
							style={{ width: 80, height: 80 }}
							className={'rounded-full object-cover'}
						/>
						<Text className='text-center mt-2'>
							{isMy
								? //@ts-ignore
								  item.guest && item.guest.name
								: //@ts-ignore
								  item.creator && item.creator.name}
						</Text>
					</TouchableOpacity>
				)
		}
	}

	return (
		<View
			key={item.id}
			className={` p-2 items-center ${
				//@ts-ignore
				(item.status === 'Invited' ||
					//@ts-ignore
					item.status === 'Cancelled') &&
				//@ts-ignore
				!item.isArchive
					? 'w-full'
					: 'w-1/3'
			}`}
		>
			{renderMeetingContent()}
		</View>
	)
}

const HomeScreenHistoryComponent: FC<HomeScreenHistoryComponentProps> = ({
	data,
	scrollY
}) => {
	const { user } = useAuth()

	return (
		<Fragment>
			<View className='p-1'>
				{data.map(
					item =>
						item.status === 'Cancelled' && //@ts-ignore
						!item.isArchive && (
							<MeetingCard
								key={item.id}
								item={item}
								//@ts-ignore
								isMy={user.user.id === item.creator.id}
							/>
						)
				)}
				{data.map(
					item =>
						item.status === 'Invited' && //@ts-ignore
						!item.isArchive && (
							<MeetingCard
								key={item.id}
								item={item}
								//@ts-ignore
								isMy={user.user.id === item.creator.id}
							/>
						)
				)}
			</View>

			<Text className='text-2xl font-bold p-4'>Назначенные встречи</Text>
			<View className='flex flex-wrap flex-row pl-4 pr-4 justify-start'>
				{data.map(
					item =>
						item.status === 'Waiting' && (
							<MeetingCard
								key={item.id}
								item={item}
								//@ts-ignore
								isMy={user.user.id === item.creator.id}
							/>
						)
				)}
			</View>

			<Text className='text-2xl font-bold p-4'>История встреч</Text>
			<View className='flex flex-wrap flex-row pl-4 pr-4 justify-start'>
				{
					data.reduce(
						(acc, item) => {
							//@ts-ignore
							if (item.isArchive && !acc.uniqueItems.has(item.guest.id)) {
								acc.uniqueItems.add(item.guest.id)
								acc.result.push(
									//@ts-ignore
									<MeetingCard
										key={item.id}
										item={item}
										//@ts-ignore
										isMy={user.user.id === item.creator.id}
									/>
								)
							}
							return acc
						},
						{ uniqueItems: new Set(), result: [] }
					).result
				}
			</View>
		</Fragment>
	)
}

export default HomeScreenHistoryComponent

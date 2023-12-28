import React, { FC, Fragment } from 'react'
import { Text, View, Image, Animated, TouchableOpacity } from 'react-native'
import { useAuth } from '@/hooks/useAuth'
import { useNavigation } from '@react-navigation/native'

interface HistoryItem {
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
	const renderMeetingContent = () => {
		switch (item.status) {
			case 'Waiting':
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
									? {
											//@ts-ignore
											uri: item.creator && item.creator.url
									  }
									: {
											//@ts-ignore
											uri: item.guest && item.guest.url
									  }
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
									  item.creator && item.creator.name
									: //@ts-ignore
									  item.guest && item.guest.name
							}
						</Text>
					</TouchableOpacity>
				)

			case 'Cancelled':
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
									? {
											//@ts-ignore
											uri: item.creator && item.creator.url
									  }
									: {
											//@ts-ignore
											uri: item.guest && item.guest.url
									  }
							}
							style={{
								width: 80,
								height: 80,
								borderWidth: 2,
								borderColor: 'red'
							}}
							className={'rounded-full object-cove'}
						/>
						<Text className='text-center mt-2'>
							{isMy
								? //@ts-ignore
								  item.creator && item.creator.name
								: //@ts-ignore
								  item.guest && item.guest.name}
						</Text>
					</TouchableOpacity>
				)

			default:
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
									? {
											//@ts-ignore
											uri: item.creator && item.creator.url
									  }
									: {
											//@ts-ignore
											uri: item.guest && item.guest.url
									  }
							}
							style={{ width: 80, height: 80 }}
							className={'rounded-full object-cover'}
						/>
						<Text className='text-center mt-2'>
							{isMy
								? //@ts-ignore
								  item.creator && item.creator.name
								: //@ts-ignore
								  item.guest && item.guest.name}
						</Text>
					</TouchableOpacity>
				)
		}
	}

	return (
		<View key={item.id} className='w-1/3 p-2 items-center'>
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
			<Text className='text-2xl font-bold p-4'>Назначенные встречи</Text>
			<View className='flex flex-wrap flex-row p-4 justify-start'>
				{data.map(
					item =>
						item.status === 'Waiting' && (
							<MeetingCard
								key={item.id}
								item={item}
								isMy={user.user.id === item.id}
							/>
						)
				)}
			</View>

			<Text className='text-2xl font-bold p-4'>История встреч</Text>
			<View className='flex flex-wrap flex-row p-4 justify-start'>
				{data.map(
					item =>
						//@ts-ignore
						item.isArchive && (
							<MeetingCard
								key={item.id}
								item={item}
								isMy={user.user.id === item.id}
							/>
						)
				)}
			</View>
		</Fragment>
	)
}

export default HomeScreenHistoryComponent

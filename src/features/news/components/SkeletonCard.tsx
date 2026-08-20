import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { View } from "react-native";

export default function SkeletonCard() {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item
        marginBottom={18}
        padding={16}
        borderRadius={16}
      >
        {/* Image */}
        <SkeletonPlaceholder.Item
          width="100%"
          height={220}
          borderRadius={14}
        />

        {/* Category */}
        <SkeletonPlaceholder.Item
          width={80}
          height={12}
          marginTop={12}
          borderRadius={4}
        />

        {/* Title */}
        <SkeletonPlaceholder.Item
          width="90%"
          height={20}
          marginTop={10}
          borderRadius={4}
        />
        <SkeletonPlaceholder.Item
          width="70%"
          height={20}
          marginTop={6}
          borderRadius={4}
        />

        {/* Summary */}
        <SkeletonPlaceholder.Item
          width="95%"
          height={14}
          marginTop={10}
          borderRadius={4}
        />
        <SkeletonPlaceholder.Item
          width="85%"
          height={14}
          marginTop={6}
          borderRadius={4}
        />

        {/* Footer Date */}
        <SkeletonPlaceholder.Item
          width={60}
          height={12}
          marginTop={12}
          borderRadius={4}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useThemeStore } from "../../store/ThemeStore";
import { getArticle } from "../../api/news";

type SourceItem = {
  source_type?: string;
  url?: string;
};

const getPoliticalColor = (sourceType: string) => {
  const normalized = (sourceType || "").toLowerCase();

  if (normalized.includes("center left")) return "#E53935";
  if (normalized.includes("center right")) return "#1E88E5";
  if (normalized.includes("left")) return "#C62828";
  if (normalized.includes("liberal")) return "#C62828";
  if (normalized.includes("right")) return "#0D47A1";
  if (normalized.includes("traditionalist")) return "#0D47A1";
  if (normalized.includes("swing")) return "#7E57C2";
  if (normalized.includes("independent")) return "#7E57C2";
  if (normalized.includes("neutral")) return "#7E57C2";

  return "#607D8B";
};

export default function SourcesScreen(props: any) {
  const { id } = props?.route?.params || {};
  const navigation = useNavigation();
  const theme = useThemeStore((s: any) => s.theme);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const fetchSources = async () => {
      try {
        setLoading(true);
        const res = await getArticle(id, true);
        const src = Array.isArray(res?.source) ? res.source : [];
        setSources(src);

        const nextExpanded: Record<string, boolean> = {};
        for (const s of src) {
          const key = s?.source_type || "Other";
          nextExpanded[key] = true;
        }
        setExpanded(nextExpanded);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, [id]);

  const grouped = useMemo(() => {
    const map: Record<string, SourceItem[]> = {};
    for (const s of sources) {
      const key = s?.source_type || "Other";
      if (!map[key]) map[key] = [];
      map[key].push(s);
    }
    return map;
  }, [sources]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme === "light" ? "#fff" : "#000" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!id) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16, backgroundColor: theme === "light" ? "#fff" : "#000" }}>
        <Text style={{ color: theme === "light" ? "#000" : "#fff" }}>Missing article id.</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16, backgroundColor: theme === "light" ? "#fff" : "#000" }}>
        <Text style={{ color: theme === "light" ? "#000" : "#fff" }}>Failed to load sources.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme === "light" ? "#fff" : "#000" }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => (navigation as any).goBack()} style={{ padding: 8, marginRight: 6 }}>
          <Icon name="arrow-back" size={22} color={theme === "light" ? "#000" : "#fff"} />
        </TouchableOpacity>
        <Text style={{ color: theme === "light" ? "#000" : "#fff", fontSize: 18, fontWeight: "700" }}>News Sources</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
          <Text style={{ color: theme === "light" ? "#666" : "#aaa", fontSize: 13 }}>
            Sources are grouped by political alignment.
          </Text>
        </View>

        {Object.keys(grouped).length === 0 ? (
          <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
            <Text style={{ color: theme === "light" ? "#000" : "#fff" }}>No sources available for this article.</Text>
          </View>
        ) : (
          Object.entries(grouped).map(([type, items]) => {
            const isOpen = expanded[type] !== false;
            const headerColor = getPoliticalColor(type);

            return (
              <View key={type} style={{ marginBottom: 12 }}>
                <TouchableOpacity
                  onPress={() => setExpanded((prev) => ({ ...prev, [type]: !isOpen }))}
                  style={{
                    marginHorizontal: 16,
                    backgroundColor: headerColor,
                    borderRadius: 12,
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>
                    {type} ({items.length})
                  </Text>
                  <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={20} color="#fff" />
                </TouchableOpacity>

                {isOpen && (
                  <View style={{ marginTop: 8 }}>
                    {items.map((s, idx) => {
                      const url = s?.url || "";
                      return (
                        <TouchableOpacity
                          key={`${type}-${idx}`}
                          onPress={() => (navigation as any).navigate("WebViewScreen", { url })}
                          disabled={!url}
                          style={{
                            marginHorizontal: 16,
                            backgroundColor: theme === "light" ? "#f5f5f5" : "#222",
                            borderRadius: 12,
                            paddingVertical: 12,
                            paddingHorizontal: 14,
                            marginBottom: 8,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={{ color: theme === "light" ? "#000" : "#fff", flex: 1 }} numberOfLines={2}>
                            {url || "(missing url)"}
                          </Text>
                          <Icon name="open-outline" size={18} color={theme === "light" ? "#000" : "#fff"} />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

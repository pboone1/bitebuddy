/**
 * Client-side "joined communities" (allergy, neighborhood, cuisine) for My Communities pages.
 */
(function () {
  const STORAGE_KEY = "bitebuddy_joined_communities";

  const ALLERGY = [
    { id: "vegetarian", label: "Vegetarian", dataTitle: "Vegetarian", href: "community-topic.html?type=allergy&name=vegetarian", img: "assets/splash/kiwi.png" },
    { id: "shellfish", label: "Shellfish", dataTitle: "Shellfish", href: "community-topic.html?type=allergy&name=shellfish", img: "assets/splash/shrimp.png" },
    { id: "gluten", label: "Gluten", dataTitle: "Gluten", href: "community-topic.html?type=allergy&name=gluten", img: "assets/splash/bread.png" },
    { id: "kiwi", label: "Kiwi", dataTitle: "Kiwi", href: "community-topic.html?type=allergy&name=kiwi", img: "assets/splash/steak.png" },
    { id: "dairy", label: "Dairy", dataTitle: "Dairy", href: "community-topic.html?type=allergy&name=dairy", img: "assets/splash/cheese.png" },
    { id: "egg", label: "Egg", dataTitle: "Egg", href: "community-topic.html?type=allergy&name=egg", img: "assets/splash/egg.png" },
    { id: "nuts", label: "Nuts", dataTitle: "Nuts", href: "community-topic.html?type=allergy&name=nuts", img: "assets/splash/almond.png" },
    { id: "pineapple", label: "Pineapple", dataTitle: "Pineapple", href: "community-topic.html?type=allergy&name=pineapple", img: "assets/splash/pineapple.png" },
    { id: "berries", label: "Berries", dataTitle: "Berries", href: "community-topic.html?type=allergy&name=berries", img: "assets/splash/blackberry.png" },
  ];

  const NEIGHBORHOOD = [
    { id: "bearden", label: "Bearden", href: "community-neighborhood.html?name=bearden" },
    { id: "north-shore", label: "North Shore", href: "community-neighborhood.html?name=north-shore" },
    { id: "north-knox", label: "North Knox", href: "community-neighborhood.html?name=north-knox" },
    { id: "downtown", label: "Downtown", href: "community-neighborhood.html?name=downtown" },
    { id: "farragut", label: "Farragut", href: "community-neighborhood.html?name=farragut" },
    { id: "cedar-bluff", label: "Cedar Bluff", href: "community-neighborhood.html?name=cedar-bluff" },
    { id: "sequoyah-hills", label: "Sequoyah Hills", href: "community-neighborhood.html?name=sequoyah-hills" },
    { id: "fort-sanders", label: "Fort Sanders", href: "community-neighborhood.html?name=fort-sanders" },
    { id: "west-knox", label: "West Knox", href: "community-neighborhood.html?name=west-knox" },
  ];

  const CUISINE = [
    { id: "american", label: "American", dataTitle: "american", href: "community-topic.html?type=cuisine&name=american", img: "assets/communities/cuisine/american.png", aria: "American community" },
    { id: "breakfast", label: "Breakfast", dataTitle: "breakfast", href: "community-topic.html?type=cuisine&name=breakfast", img: "assets/communities/cuisine/breakfast.png", aria: "Breakfast community" },
    { id: "chinese", label: "Chinese", dataTitle: "chinese", href: "community-topic.html?type=cuisine&name=chinese", img: "assets/communities/cuisine/chinese.png", aria: "Chinese community" },
    { id: "french", label: "French", dataTitle: "french", href: "community-topic.html?type=cuisine&name=french", img: "assets/communities/cuisine/french.png", aria: "French community" },
    { id: "indian", label: "Indian", dataTitle: "indian", href: "community-topic.html?type=cuisine&name=indian", img: "assets/communities/cuisine/indian.png", aria: "Indian community" },
    { id: "italian", label: "Italian", dataTitle: "italian", href: "community-topic.html?type=cuisine&name=italian", img: "assets/communities/cuisine/italian.png", aria: "Italian community" },
    { id: "japanese", label: "Japanese", dataTitle: "japanese", href: "community-topic.html?type=cuisine&name=japanese", img: "assets/communities/cuisine/japanese.png", aria: "Japanese community" },
    { id: "mediterranean", label: "Mediterranean", dataTitle: "mediterranean", href: "community-topic.html?type=cuisine&name=mediterranean", img: "assets/communities/cuisine/mediterranean.png", aria: "Mediterranean community" },
    { id: "mexican", label: "Mexican", dataTitle: "mexican", href: "community-topic.html?type=cuisine&name=mexican", img: "assets/communities/cuisine/mexican.png", aria: "Mexican community" },
  ];

  const byId = (list) => {
    const m = new Map();
    list.forEach((item) => m.set(item.id, item));
    return m;
  };

  const ALLERGY_BY_ID = byId(ALLERGY);
  const NEIGHBORHOOD_BY_ID = byId(NEIGHBORHOOD);
  const CUISINE_BY_ID = byId(CUISINE);

  function sortIdsByListOrder(ids, orderedList) {
    const order = new Map(orderedList.map((item, i) => [item.id, i]));
    return [...new Set(ids)].filter((id) => order.has(id)).sort((a, b) => order.get(a) - order.get(b));
  }

  function loadPicks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { allergies: [], neighborhoods: [], cuisines: [] };
      const p = JSON.parse(raw);
      return {
        allergies: sortIdsByListOrder(Array.isArray(p.allergies) ? p.allergies : [], ALLERGY),
        neighborhoods: sortIdsByListOrder(Array.isArray(p.neighborhoods) ? p.neighborhoods : [], NEIGHBORHOOD),
        cuisines: sortIdsByListOrder(Array.isArray(p.cuisines) ? p.cuisines : [], CUISINE),
      };
    } catch {
      return { allergies: [], neighborhoods: [], cuisines: [] };
    }
  }

  function savePicks(picks) {
    const clean = {
      allergies: sortIdsByListOrder(picks.allergies || [], ALLERGY),
      neighborhoods: sortIdsByListOrder(picks.neighborhoods || [], NEIGHBORHOOD),
      cuisines: sortIdsByListOrder(picks.cuisines || [], CUISINE),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    return clean;
  }

  window.BiteBuddyCommunities = {
    STORAGE_KEY,
    ALLERGY,
    NEIGHBORHOOD,
    CUISINE,
    ALLERGY_BY_ID,
    NEIGHBORHOOD_BY_ID,
    CUISINE_BY_ID,
    loadPicks,
    savePicks,
  };
})();

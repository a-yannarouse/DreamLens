import { firestore } from '../../../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { getAuth } from '@clerk/nextjs/server'; // Import Clerk's server-side auth
import { fetchDreamAnalysis } from '@/utils/openai';

const analysisCache = new Map();
let lastApiCallTimestamp = 0;
const API_CALL_INTERVAL = 20000; // 20 seconds in milliseconds

export async function GET(req) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader ? authHeader.split(' ')[1] : null;

  console.log('Token:', token); // Log the token for debugging

  if (!token) {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
  }

  try {
    const { userId } = await getAuth(req);

    console.log('User ID:', userId); // Log the userId for debugging

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
    }

    const dreamData = await getDocs(query(
      collection(firestore, 'dreams'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    ));

    const dreams = await Promise.all(dreamData.docs.map(async (doc) => {
        const data = doc.data();
        let themes = [];
  
        if (!data.openAiAnalysis) {
          if (analysisCache.has(doc.id)) {
            themes = analysisCache.get(doc.id);
          } else {
            const currentTime = Date.now();
            if (currentTime - lastApiCallTimestamp < API_CALL_INTERVAL) {
              await new Promise(resolve => setTimeout(resolve, API_CALL_INTERVAL - (currentTime - lastApiCallTimestamp)));
            }
  
            try {
              const analysis = await fetchDreamAnalysis(data.content);
              themes = extractThemesFromAnalysis(analysis);
              analysisCache.set(doc.id, themes);
              lastApiCallTimestamp = Date.now();
  
              // Update Firestore with the new analysis
              await updateDoc(doc.ref, { openAiAnalysis: analysis, themes });
            } catch (error) {
              console.error('Error fetching OpenAI analysis:', error);
              themes = ['Analysis Pending'];
            }
          }
        } else {
          themes = data.themes || extractThemesFromAnalysis(data.openAiAnalysis);
        }
  
        return {
          ...data,
          timestamp: data.timestamp.toDate().toISOString(),
          theme: themes
        };
      }));
  
      console.log('Retrieved Dreams with Themes:', dreams);
      return new Response(JSON.stringify(dreams), { status: 200 });
    } catch (error) {
      console.error('Error fetching dream stats:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch dream stats', details: error.message }), { status: 500 });
    }
  }

  function extractThemesFromAnalysis(analysis) {
    // This function should parse the OpenAI analysis and extract themes
    // The implementation will depend on the structure of your OpenAI response
    // Here's a simple example:
    const themeMatch = analysis.match(/Themes:(.*?)(?:\n|$)/i);
    if (themeMatch && themeMatch[1]) {
      return themeMatch[1].split(',').map(theme => theme.trim());
    }
    return ['Unspecified'];
  }
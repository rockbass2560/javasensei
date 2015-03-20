package javasensei.ia.fuzzylogic.tutor;

import javasensei.estudiante.ModeloEstudiante;
import net.sourceforge.jFuzzyLogic.FIS;

/**
 *
 * @author Rock
 */
public class CaminoErroneoFuzzyLogic extends CaminoFuzzyLogic{    
    public CaminoErroneoFuzzyLogic(ModeloEstudiante estudiante){
        super(estudiante);
        if (fuzzySystem==null)
            fuzzySystem = FIS.load(getFile());
    }
    
    protected static FIS fuzzySystem;
    
    @Override
    protected FIS getFuzzySystem(){
        return fuzzySystem;
    }

    @Override
    protected String getFile() {
        return getFile("caminoerroneo.fcl");
    }
}
